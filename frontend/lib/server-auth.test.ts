import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { accessTokenFromJwt } from './access-token-from-jwt.ts';

describe('accessTokenFromJwt', () => {
  it('returns null when there is no JWT', () => {
    assert.equal(accessTokenFromJwt(null), null);
  });

  it('returns null when refresh failed, even if a stale accessToken is still present', () => {
    assert.equal(
      accessTokenFromJwt({
        accessToken: 'stale-access',
        error: 'RefreshTokenExpired',
      }),
      null,
    );
  });

  it('returns null when the access token itself expired and could not be refreshed', () => {
    assert.equal(
      accessTokenFromJwt({
        accessToken: 'stale-access',
        error: 'AccessTokenExpired',
      }),
      null,
    );
  });

  it('returns the Nest access token from a healthy JWT', () => {
    assert.equal(accessTokenFromJwt({ accessToken: 'nest-access' }), 'nest-access');
  });
});
