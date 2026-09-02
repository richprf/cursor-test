import { HttpException, HttpStatus } from '@nestjs/common';

/** Credentials account exists for this email; Google must not auto-link. */
export class CredentialsAccountExistsException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        error: 'Conflict',
        code: 'CREDENTIALS_ACCOUNT_EXISTS',
        message:
          'This email already has a password. Sign in with email and password, then link Google from your dashboard.',
      },
      HttpStatus.CONFLICT,
    );
  }
}
