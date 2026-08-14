import { ConfigService } from '@nestjs/config';
import { firstValueFrom, take, toArray } from 'rxjs';
import { GoldPriceService } from './gold-price.service';

function createService(overrides: Record<string, unknown> = {}) {
  const config = {
    get: (key: string, fallback?: unknown) => overrides[key] ?? fallback,
  } as unknown as ConfigService;

  return new GoldPriceService(config);
}

describe('GoldPriceService', () => {
  afterEach(() => jest.useRealTimers());

  it('seeds a full history window so the first client can draw a chart', () => {
    const snapshot = createService().getSnapshot();

    expect(snapshot.history).toHaveLength(24);
    expect(snapshot.simulated).toBe(true);
    expect(snapshot.current.price).toBe(snapshot.history[snapshot.history.length - 1].price);
    expect(snapshot.history.every((point) => point.price > 0)).toBe(true);
    // Timestamps must be ascending, otherwise the chart would zig-zag in time.
    expect(snapshot.history.every((point, i, all) => i === 0 || point.t > all[i - 1].t)).toBe(true);
  });

  it('publishes ticks on the configured interval and keeps the window length fixed', async () => {
    jest.useFakeTimers();
    const service = createService({ GOLD_PRICE_INTERVAL_MS: 1000 });
    service.onModuleInit();

    const collected = firstValueFrom(service.ticks.pipe(take(3), toArray()));

    for (let i = 0; i < 3; i += 1) {
      jest.advanceTimersByTime(1000);
      // Let the service's promise chain settle between ticks.
      await Promise.resolve();
    }

    const ticks = await collected;
    expect(ticks).toHaveLength(3);
    expect(ticks[1].previousPrice).toBe(ticks[0].price);
    expect(service.getSnapshot().history).toHaveLength(24);

    service.onModuleDestroy();
  });

  it('stays near the base price over a long run', async () => {
    jest.useFakeTimers();
    const service = createService({ GOLD_PRICE_INTERVAL_MS: 100 });
    service.onModuleInit();

    for (let i = 0; i < 500; i += 1) {
      jest.advanceTimersByTime(100);
      await Promise.resolve();
    }

    const { current } = service.getSnapshot();
    // Mean reversion should keep the walk within a few percent of 3,240,000.
    expect(current.price).toBeGreaterThan(3_000_000);
    expect(current.price).toBeLessThan(3_500_000);
    expect(Math.abs(current.changePercent)).toBeLessThan(10);

    service.onModuleDestroy();
  });

  it('uses an external feed when configured', async () => {
    const fetchSpy = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ price: 4_100_000 })));

    const service = createService({ GOLD_PRICE_API_URL: 'http://feed.test/price' });
    expect(service.getSnapshot().simulated).toBe(false);

    service.onModuleInit();
    const tick = firstValueFrom(service.ticks);
    jest.advanceTimersByTime(0);

    // Wait for the real (unmocked) timer to fire once.
    await new Promise((resolve) => setTimeout(resolve, 3100));
    await expect(tick).resolves.toMatchObject({ price: 4_100_000 });

    expect(fetchSpy).toHaveBeenCalledWith('http://feed.test/price', expect.anything());
    service.onModuleDestroy();
    fetchSpy.mockRestore();
  }, 10_000);

  it('falls back to the simulation when the feed fails', async () => {
    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));

    const service = createService({
      GOLD_PRICE_API_URL: 'http://feed.test/price',
      GOLD_PRICE_INTERVAL_MS: 50,
    });
    service.onModuleInit();

    const tick = await firstValueFrom(service.ticks);
    expect(tick.price).toBeGreaterThan(0);

    service.onModuleDestroy();
    fetchSpy.mockRestore();
  });
});
