import { Logger, type OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import type { Subscription } from 'rxjs';
import { GoldPriceService } from './gold-price.service';
import { GOLD_PRICE_EVENTS } from './gold-price.types';

/**
 * Public read-only price feed on the `/gold-price` namespace. No auth: the landing
 * page needs it before the visitor has an account, and it exposes nothing private.
 */
@WebSocketGateway({
  namespace: 'gold-price',
  cors: { origin: true, credentials: true },
})
export class GoldPriceGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, OnModuleDestroy
{
  private readonly logger = new Logger(GoldPriceGateway.name);
  private subscription?: Subscription;

  @WebSocketServer()
  private server!: Server;

  constructor(
    private readonly goldPrice: GoldPriceService,
    private readonly config: ConfigService,
  ) {}

  afterInit() {
    // Subscribe once the namespace server exists; ticks emitted before this are still
    // available via getSnapshot() when a client connects.
    this.subscription = this.goldPrice.ticks.subscribe((tick) => {
      this.server.emit(GOLD_PRICE_EVENTS.tick, tick);
    });
  }

  onModuleDestroy() {
    this.subscription?.unsubscribe();
  }

  handleConnection(client: Socket) {
    
    if (!this.isAllowedOrigin(client)) {
      this.logger.warn(
        `Rejected socket from origin ${client.handshake.headers.origin ?? '(none)'}`,
      );
      client.disconnect(true);
      return;
    }

    // Latest price plus the history window, so the client can render immediately
    // instead of waiting for the next tick.
    client.emit(GOLD_PRICE_EVENTS.snapshot, this.goldPrice.getSnapshot());
  }

  handleDisconnect() {
    // Nothing to clean up per client; socket.io removes it from the namespace.
  }

  /**
   * socket.io's own CORS check only covers browsers' preflight, so the origin is
   * verified here too against the same allow-list the REST API uses.
   */
  private isAllowedOrigin(client: Socket): boolean {
    const origin = client.handshake.headers.origin;
    if (!origin) return true; // non-browser clients (tests, server-to-server)

    const allowed = this.config
      .get<string>('CORS_ORIGINS', 'http://localhost:3000')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    return allowed.includes(origin);
  }
}
