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
import { CredentialsAccountExistsException } from './credentials-account-exists.exception';
import { UsersService } from '../users/users.service';
import type { PrismaService } from '../prisma/prisma.service';
import type { UserModel as User } from '../generated/prisma/models';

const baseUser: User & { shop: null } = {
  id: 'user-1',
  email: 'ali@example.com',
  name: 'Ali',
  image: null,
  passwordHash: null,
  provider: 'CREDENTIALS',
  googleId: null,
  role: 'BUYER',
  onboardingComplete: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  shop: null,
};

describe('AuthService', () => {
  let users: jest.Mocked<
    Pick<
      UsersService,
      | 'findByEmail'
      | 'findById'
      | 'findByGoogleId'
      | 'createWithPassword'
      | 'createGoogleUser'
      | 'linkGoogleIdentity'
    >
  >;
  let prisma: {
    refreshToken: {
      create: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
    };
  };
  let service: AuthService;

  beforeEach(() => {
    users = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findByGoogleId: jest.fn(),
      createWithPassword: jest.fn(),
      createGoogleUser: jest.fn(),
      linkGoogleIdentity: jest.fn(),
    };
    prisma = {
      refreshToken: {
        create: jest.fn().mockResolvedValue({ id: 'rt-1' }),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    const jwt = new JwtService({ secret: 'test-secret', signOptions: { expiresIn: '15m' } });
    const config = {
      get: jest.fn((key: string, fallback?: string) => {
        if (key === 'GOOGLE_CLIENT_ID') return 'client-id.apps.googleusercontent.com';
        if (key === 'JWT_EXPIRES_IN') return '15m';
        if (key === 'JWT_REFRESH_EXPIRES_IN') return '30d';
        return fallback;
      }),
    } as unknown as ConfigService;

    service = new AuthService(
      users as unknown as UsersService,
      jwt,
      config,
      prisma as unknown as PrismaService,
    );
  });

  describe('register', () => {
    it('stores a bcrypt hash and returns access and refresh tokens', async () => {
      users.findByEmail.mockResolvedValue(null);
      users.createWithPassword.mockImplementation(({ email, passwordHash, name, role }) =>
        Promise.resolve({
          ...baseUser,
          email,
          passwordHash,
          name: name ?? null,
          role: role === 'SELLER' ? 'SELLER' : 'BUYER',
        }),
      );

      const result = await service.register({
        email: 'ali@example.com',
        password: 'supersecret1',
        name: 'Ali',
        role: 'BUYER',
      });

      const { passwordHash } = users.createWithPassword.mock.calls[0][0];
      expect(passwordHash).not.toBe('supersecret1');
      await expect(bcrypt.compare('supersecret1', passwordHash)).resolves.toBe(true);
      expect(users.createWithPassword).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'BUYER', shopName: undefined }),
      );

      expect(result.user).toEqual({
        id: 'user-1',
        email: 'ali@example.com',
        name: 'Ali',
        image: null,
        role: 'BUYER',
        provider: 'CREDENTIALS',
        onboardingComplete: true,
        shopName: null,
        logoUrl: null,
        googleLinked: false,
      });
      expect(result.accessToken).toEqual(expect.any(String));
      expect(result.refreshToken).toEqual(expect.any(String));
      expect(result.accessTokenExpires).toBeGreaterThan(Date.now());
      expect(prisma.refreshToken.create).toHaveBeenCalled();
    });

    it('creates a seller with a shop name', async () => {
      users.findByEmail.mockResolvedValue(null);
      users.createWithPassword.mockImplementation(({ email, passwordHash, name, shopName }) =>
        Promise.resolve({
          ...baseUser,
          email,
          passwordHash,
          name: name ?? null,
          role: 'SELLER',
          shop: {
            id: 'shop-1',
            name: shopName ?? 'Ali Gold',
            logoUrl: null,
            userId: 'user-1',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }),
      );

      const result = await service.register({
        email: 'ali@example.com',
        password: 'supersecret1',
        name: 'Ali',
        role: 'SELLER',
        shopName: 'Ali Gold',
      });

      expect(users.createWithPassword).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'SELLER', shopName: 'Ali Gold' }),
      );
      expect(result.user.role).toBe('SELLER');
      expect(result.user.shopName).toBe('Ali Gold');
    });

    it('rejects an email that is already taken', async () => {
      users.findByEmail.mockResolvedValue(baseUser);

      await expect(
        service.register({ email: 'ali@example.com', password: 'supersecret1', role: 'BUYER' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('maps a Prisma unique-constraint error to a conflict instead of a 500', async () => {
      users.findByEmail.mockResolvedValue(null);
      users.createWithPassword.mockRejectedValue(Object.assign(new Error('unique'), { code: 'P2002' }));

      await expect(
        service.register({ email: 'ali@example.com', password: 'supersecret1', role: 'BUYER' }),
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
      expect(result.refreshToken).toEqual(expect.any(String));
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

  describe('refresh', () => {
    it('rotates a valid refresh token', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt-old',
        userId: 'user-1',
        tokenHash: 'hash',
        expiresAt: new Date(Date.now() + 60_000),
        revokedAt: null,
        replacedById: null,
        user: baseUser,
      });
      prisma.refreshToken.create.mockResolvedValue({ id: 'rt-new' });

      const result = await service.refresh('a'.repeat(32));

      expect(result.user.id).toBe('user-1');
      expect(result.refreshToken).toEqual(expect.any(String));
      expect(prisma.refreshToken.update).toHaveBeenCalledWith({
        where: { id: 'rt-old' },
        data: { revokedAt: expect.any(Date), replacedById: 'rt-new' },
      });
    });

    it('rejects an unknown refresh token', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue(null);
      await expect(service.refresh('missing-token-value-here')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rejects a token revoked by logout even inside the rotation grace window', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt-old',
        userId: 'user-1',
        tokenHash: 'hash',
        expiresAt: new Date(Date.now() + 60_000),
        revokedAt: new Date(),
        replacedById: null,
        user: baseUser,
      });

      await expect(service.refresh('a'.repeat(32))).rejects.toBeInstanceOf(UnauthorizedException);
      expect(prisma.refreshToken.updateMany).toHaveBeenCalled();
    });

    it('allows a concurrent reuse while the rotated successor is still live', async () => {
      prisma.refreshToken.findUnique.mockImplementation(({ where }: { where: { tokenHash?: string; id?: string } }) => {
        if (where.id === 'rt-new') {
          return Promise.resolve({
            id: 'rt-new',
            userId: 'user-1',
            tokenHash: 'hash-new',
            expiresAt: new Date(Date.now() + 60_000),
            revokedAt: null,
            replacedById: null,
          });
        }
        return Promise.resolve({
          id: 'rt-old',
          userId: 'user-1',
          tokenHash: 'hash',
          expiresAt: new Date(Date.now() + 60_000),
          revokedAt: new Date(),
          replacedById: 'rt-new',
          user: baseUser,
        });
      });
      prisma.refreshToken.create.mockResolvedValue({ id: 'rt-grace' });

      const result = await service.refresh('a'.repeat(32));
      expect(result.refreshToken).toEqual(expect.any(String));
      expect(prisma.refreshToken.updateMany).not.toHaveBeenCalled();
    });

    it('rejects a rotated token after logout revoked the successor', async () => {
      prisma.refreshToken.findUnique.mockImplementation(({ where }: { where: { tokenHash?: string; id?: string } }) => {
        if (where.id === 'rt-new') {
          return Promise.resolve({
            id: 'rt-new',
            userId: 'user-1',
            tokenHash: 'hash-new',
            expiresAt: new Date(Date.now() + 60_000),
            revokedAt: new Date(),
            replacedById: null,
          });
        }
        return Promise.resolve({
          id: 'rt-old',
          userId: 'user-1',
          tokenHash: 'hash',
          expiresAt: new Date(Date.now() + 60_000),
          revokedAt: new Date(),
          replacedById: 'rt-new',
          user: baseUser,
        });
      });

      await expect(service.refresh('a'.repeat(32))).rejects.toBeInstanceOf(UnauthorizedException);
      expect(prisma.refreshToken.updateMany).toHaveBeenCalled();
    });

    it('revokes the family when a token is reused after the grace window', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt-old',
        userId: 'user-1',
        tokenHash: 'hash',
        expiresAt: new Date(Date.now() + 60_000),
        revokedAt: new Date(Date.now() - 60_000),
        replacedById: 'rt-new',
        user: baseUser,
      });

      await expect(service.refresh('a'.repeat(32))).rejects.toBeInstanceOf(UnauthorizedException);
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });

  describe('logout', () => {
    it('revokes every live refresh token for the user', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt-current',
        userId: 'user-1',
        tokenHash: 'hash',
        expiresAt: new Date(Date.now() + 60_000),
        revokedAt: null,
        replacedById: null,
      });

      await service.logout('a'.repeat(32));

      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });

  describe('loginWithGoogle', () => {
    const verifyIdToken = jest.spyOn(OAuth2Client.prototype, 'verifyIdToken');

    afterEach(() => verifyIdToken.mockReset());

    function mockGooglePayload(payload: Record<string, unknown>) {
      verifyIdToken.mockResolvedValue({ getPayload: () => payload } as never);
    }

    it('verifies the id_token against the configured client id and creates a Google user', async () => {
      mockGooglePayload({
        sub: 'google-123',
        email: 'ali@example.com',
        email_verified: true,
        name: 'Ali From Google',
        picture: 'https://example.com/a.png',
      });
      users.findByGoogleId.mockResolvedValue(null);
      users.findByEmail.mockResolvedValue(null);
      users.createGoogleUser.mockResolvedValue({
        ...baseUser,
        provider: 'GOOGLE',
        googleId: 'google-123',
        image: 'https://example.com/a.png',
        onboardingComplete: false,
      });

      const result = await service.loginWithGoogle({ idToken: 'header.payload.signature' });

      expect(verifyIdToken).toHaveBeenCalledWith({
        idToken: 'header.payload.signature',
        audience: ['client-id.apps.googleusercontent.com'],
      });
      expect(users.createGoogleUser).toHaveBeenCalledWith({
        googleId: 'google-123',
        email: 'ali@example.com',
        name: 'Ali From Google',
        image: 'https://example.com/a.png',
      });
      expect(result.accessToken).toEqual(expect.any(String));
      expect(result.refreshToken).toEqual(expect.any(String));
      expect(result.user.onboardingComplete).toBe(false);
      expect(result.user.googleLinked).toBe(true);
    });

    it('refuses to auto-link a credentials account that has a password', async () => {
      mockGooglePayload({
        sub: 'google-123',
        email: 'ali@example.com',
        email_verified: true,
      });
      users.findByGoogleId.mockResolvedValue(null);
      users.findByEmail.mockResolvedValue({
        ...baseUser,
        passwordHash: await bcrypt.hash('supersecret1', 4),
      });

      await expect(service.loginWithGoogle({ idToken: 'a.b.c' })).rejects.toBeInstanceOf(
        CredentialsAccountExistsException,
      );
      expect(users.createGoogleUser).not.toHaveBeenCalled();
      expect(users.linkGoogleIdentity).not.toHaveBeenCalled();
    });

    it('rejects a token Google does not vouch for', async () => {
      verifyIdToken.mockRejectedValue(new Error('Invalid token signature') as never);

      await expect(service.loginWithGoogle({ idToken: 'a.b.c' })).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(users.createGoogleUser).not.toHaveBeenCalled();
    });

    it('rejects an unverified Google email', async () => {
      mockGooglePayload({ sub: 'google-123', email: 'ali@example.com', email_verified: false });

      await expect(service.loginWithGoogle({ idToken: 'a.b.c' })).rejects.toThrow(
        'Google email address is not verified',
      );
      expect(users.createGoogleUser).not.toHaveBeenCalled();
    });

    it('refuses to sign in when no audience is configured', async () => {
      const jwt = new JwtService({ secret: 'test-secret' });
      const config = { get: jest.fn(() => undefined) } as unknown as ConfigService;
      const unconfigured = new AuthService(
        users as unknown as UsersService,
        jwt,
        config,
        prisma as unknown as PrismaService,
      );

      await expect(unconfigured.loginWithGoogle({ idToken: 'a.b.c' })).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      expect(verifyIdToken).not.toHaveBeenCalled();
    });
  });
});
