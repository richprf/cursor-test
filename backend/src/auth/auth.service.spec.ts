import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import type { UserModel as User } from '../generated/prisma/models';

const baseUser: User = {
  id: 'user-1',
  email: 'ali@example.com',
  name: 'Ali',
  image: null,
  passwordHash: null,
  provider: 'CREDENTIALS',
  googleId: null,
  role: 'USER',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let users: jest.Mocked<
    Pick<UsersService, 'findByEmail' | 'findById' | 'createWithPassword' | 'upsertGoogleUser'>
  >;
  let service: AuthService;

  beforeEach(() => {
    users = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      createWithPassword: jest.fn(),
      upsertGoogleUser: jest.fn(),
    };

    const jwt = new JwtService({ secret: 'test-secret', signOptions: { expiresIn: '1h' } });
    const config = {
      get: jest.fn((key: string) =>
        key === 'GOOGLE_CLIENT_ID' ? 'client-id.apps.googleusercontent.com' : undefined,
      ),
    } as unknown as ConfigService;

    service = new AuthService(users as unknown as UsersService, jwt, config);
  });

  describe('register', () => {
    it('stores a bcrypt hash and returns a signed access token', async () => {
      users.findByEmail.mockResolvedValue(null);
      users.createWithPassword.mockImplementation(({ email, passwordHash, name }) =>
        Promise.resolve({ ...baseUser, email, passwordHash, name: name ?? null }),
      );

      const result = await service.register({
        email: 'ali@example.com',
        password: 'supersecret1',
        name: 'Ali',
      });

      const { passwordHash } = users.createWithPassword.mock.calls[0][0];
      expect(passwordHash).not.toBe('supersecret1');
      await expect(bcrypt.compare('supersecret1', passwordHash)).resolves.toBe(true);

      expect(result.user).toEqual({
        id: 'user-1',
        email: 'ali@example.com',
        name: 'Ali',
        image: null,
        role: 'USER',
        provider: 'CREDENTIALS',
      });
      expect(result.accessToken).toEqual(expect.any(String));
      expect(result.accessTokenExpires).toBeGreaterThan(Date.now());
    });

    it('rejects an email that is already taken', async () => {
      users.findByEmail.mockResolvedValue(baseUser);

      await expect(
        service.register({ email: 'ali@example.com', password: 'supersecret1' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('maps a Prisma unique-constraint error to a conflict instead of a 500', async () => {
      users.findByEmail.mockResolvedValue(null);
      users.createWithPassword.mockRejectedValue(Object.assign(new Error('unique'), { code: 'P2002' }));

      await expect(
        service.register({ email: 'ali@example.com', password: 'supersecret1' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('login', () => {
    it('accepts the correct password', async () => {
      users.findByEmail.mockResolvedValue({
        ...baseUser,
        passwordHash: await bcrypt.hash('supersecret1', 4),
      });

      const result = await service.login({ email: 'ali@example.com', password: 'supersecret1' });
      expect(result.user.id).toBe('user-1');
    });

    it('rejects a wrong password', async () => {
      users.findByEmail.mockResolvedValue({
        ...baseUser,
        passwordHash: await bcrypt.hash('supersecret1', 4),
      });

      await expect(
        service.login({ email: 'ali@example.com', password: 'nope' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects an unknown email without leaking that it is unknown', async () => {
      users.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nobody@example.com', password: 'supersecret1' }),
      ).rejects.toThrow('Invalid email or password');
    });

    it('rejects a Google-only account that has no password', async () => {
      users.findByEmail.mockResolvedValue({ ...baseUser, provider: 'GOOGLE', passwordHash: null });

      await expect(
        service.login({ email: 'ali@example.com', password: 'supersecret1' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('loginWithGoogle', () => {
    const verifyIdToken = jest.spyOn(OAuth2Client.prototype, 'verifyIdToken');

    afterEach(() => verifyIdToken.mockReset());

    function mockGooglePayload(payload: Record<string, unknown>) {
      verifyIdToken.mockResolvedValue({ getPayload: () => payload } as never);
    }

    it('verifies the id_token against the configured client id and upserts the user', async () => {
      mockGooglePayload({
        sub: 'google-123',
        email: 'ali@example.com',
        email_verified: true,
        name: 'Ali From Google',
        picture: 'https://example.com/a.png',
      });
      users.upsertGoogleUser.mockResolvedValue({
        ...baseUser,
        provider: 'GOOGLE',
        googleId: 'google-123',
        image: 'https://example.com/a.png',
      });

      const result = await service.loginWithGoogle({ idToken: 'header.payload.signature' });

      expect(verifyIdToken).toHaveBeenCalledWith({
        idToken: 'header.payload.signature',
        audience: ['client-id.apps.googleusercontent.com'],
      });
      expect(users.upsertGoogleUser).toHaveBeenCalledWith({
        googleId: 'google-123',
        email: 'ali@example.com',
        name: 'Ali From Google',
        image: 'https://example.com/a.png',
      });
      expect(result.accessToken).toEqual(expect.any(String));
    });

    it('rejects a token Google does not vouch for', async () => {
      verifyIdToken.mockRejectedValue(new Error('Invalid token signature'));

      await expect(service.loginWithGoogle({ idToken: 'a.b.c' })).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(users.upsertGoogleUser).not.toHaveBeenCalled();
    });

    it('rejects an unverified Google email', async () => {
      mockGooglePayload({ sub: 'google-123', email: 'ali@example.com', email_verified: false });

      await expect(service.loginWithGoogle({ idToken: 'a.b.c' })).rejects.toThrow(
        'Google email address is not verified',
      );
      expect(users.upsertGoogleUser).not.toHaveBeenCalled();
    });

    it('refuses to sign in when no audience is configured', async () => {
      const jwt = new JwtService({ secret: 'test-secret' });
      const config = { get: jest.fn(() => undefined) } as unknown as ConfigService;
      const unconfigured = new AuthService(users as unknown as UsersService, jwt, config);

      await expect(unconfigured.loginWithGoogle({ idToken: 'a.b.c' })).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      expect(verifyIdToken).not.toHaveBeenCalled();
    });
  });
});
