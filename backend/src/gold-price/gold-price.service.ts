import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subject } from 'rxjs';
import type { GoldPricePoint, GoldPriceSnapshot, GoldPriceTick } from './gold-price.types';

/** Number of points kept in memory; the chart draws exactly this many. */
const HISTORY_POINTS = 24;
/** Starting point of the simulation: Toman per gram of 18k gold. */
const BASE_PRICE = 3_240_000;
/** Maximum move per tick, as a fraction of the current price. */
const MAX_STEP = 0.0035;
/** Pull towards `BASE_PRICE` so a long random walk cannot drift away. */
const MEAN_REVERSION = 0.06;

@Injectable()
export class GoldPriceService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(GoldPriceService.name);
  private readonly ticks$ = new Subject<GoldPriceTick>();

  private history: GoldPricePoint[] = [];
  private current!: GoldPriceTick;
  private timer?: NodeJS.Timeout;

  private readonly intervalMs: number;
  /** When set, prices come from this endpoint instead of the simulation. */
  private readonly feedUrl?: string;

  constructor(config: ConfigService) {
    this.intervalMs = Number(config.get('GOLD_PRICE_INTERVAL_MS', 3000));
    this.feedUrl = config.get<string>('GOLD_PRICE_API_URL') || undefined;
    this.seedHistory();
  }

  onModuleInit() {
    this.timer = setInterval(() => void this.publishNextPrice(), this.intervalMs);
    this.logger.log(
      `Publishing gold prices every ${this.intervalMs}ms (${this.feedUrl ? `feed: ${this.feedUrl}` : 'simulated'})`,
    );
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
    this.ticks$.complete();
  }

  /** Stream of published prices; the gateway broadcasts whatever arrives here. */
  get ticks() {
    return this.ticks$.asObservable();
  }

  getSnapshot(): GoldPriceSnapshot {
    return {
      current: this.current,
      history: [...this.history],
      intervalMs: this.intervalMs,
      simulated: !this.feedUrl,
    };
  }

  /** Fills the window with a plausible past so the first render is not a flat line. */
  private seedHistory() {
    const now = Date.now();
    let price = BASE_PRICE * (1 - MAX_STEP * HISTORY_POINTS * 0.25);

    for (let index = 0; index < HISTORY_POINTS; index += 1) {
      price = this.nextSimulatedPrice(price);
      this.history.push({ t: now - (HISTORY_POINTS - 1 - index) * this.intervalMs, price });
    }

    const last = this.history[this.history.length - 1];
    this.current = this.buildTick(last, last.price);
  }

  private async publishNextPrice() {
    const previousPrice = this.current.price;
    const price = (await this.fetchFeedPrice()) ?? this.nextSimulatedPrice(previousPrice);
    const point: GoldPricePoint = { t: Date.now(), price };

    // Fixed-length window: the oldest point drops off as the newest arrives.
    this.history = [...this.history.slice(1), point];
    this.current = this.buildTick(point, previousPrice);

    this.ticks$.next(this.current);
  }

  private buildTick(point: GoldPricePoint, previousPrice: number): GoldPriceTick {
    const oldest = this.history[0]?.price ?? point.price;

    return {
      ...point,
      previousPrice,
      changePercent: Number((((point.price - oldest) / oldest) * 100).toFixed(2)),
      currency: 'IRT',
      unit: 'gram-18k',
    };
  }

  /** Random walk with mean reversion, rounded to whole Toman. */
  private nextSimulatedPrice(previous: number): number {
    const drift = (BASE_PRICE - previous) * MEAN_REVERSION;
    const noise = previous * MAX_STEP * (Math.random() * 2 - 1);
    return Math.round(previous + drift + noise);
  }

  /**
   * Optional real feed. Anything unexpected (network error, bad payload) falls back
   * to the simulation for that tick rather than breaking the stream.
   */
  private async fetchFeedPrice(): Promise<number | null> {
    if (!this.feedUrl) return null;

    try {
      const response = await fetch(this.feedUrl, {
        signal: AbortSignal.timeout(Math.min(this.intervalMs, 2500)),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const body: unknown = await response.json();
      const price = (body as { price?: unknown })?.price;

      if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
        throw new Error('payload has no numeric `price`');
      }
      return Math.round(price);
    } catch (error) {
      this.logger.warn(`Gold price feed unavailable (${(error as Error).message}); simulating`);
      return null;
    }
  }
}
