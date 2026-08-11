import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Every request to this API arrives from the Next.js server, so its IP address is
 * the same for all visitors and IP-based throttling would punish everyone for one
 * attacker. Requests that carry an email (login / register) are therefore counted
 * per email address, which is also the thing a brute-force attack targets.
 *
 * If the API is ever exposed to browsers directly, enable Express' `trust proxy`
 * so `req.ip` is the real client address.
 */
@Injectable()
export class AuthThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    const email: unknown = (req.body as { email?: unknown } | undefined)?.email;

    if (typeof email === 'string' && email.trim().length > 0) {
      return Promise.resolve(`email:${email.trim().toLowerCase()}`);
    }

    return Promise.resolve(`ip:${req.ip}`);
  }
}
