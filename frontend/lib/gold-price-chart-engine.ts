import { CHART_POINTS, type GoldPricePoint } from '@/lib/gold-price';

const HEIGHT = 240;
const PADDING = { top: 22, right: 12, bottom: 28, left: 12 };
const LERP = 0.18;

type PlotPoint = { x: number; y: number; price: number };

export class GoldPriceChartEngine {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly resizeObserver: ResizeObserver;
  private width = 0;
  private dpr = 1;

  private target: PlotPoint[] = [];
  private display: PlotPoint[] = [];
  private rawWindow: GoldPricePoint[] = [];
  private rafId = 0;
  private animating = false;
  private lastFirstT = 0;

  constructor(private readonly container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('role', 'img');
    this.canvas.setAttribute('aria-label', 'نمودار زندهٔ قیمت طلای ۱۸ عیار');
    this.canvas.className = 'block h-full w-full';
    this.container.appendChild(this.canvas);

    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D is unavailable');
    this.ctx = context;

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();
  }

  /** Push the latest history window from the WebSocket stream. */
  sync(history: GoldPricePoint[]) {
    this.rawWindow = history.slice(-CHART_POINTS);
    if (this.rawWindow.length === 0) return;

    const firstT = this.rawWindow[0].t;
    const scaled = this.scale(this.rawWindow);

    this.target = scaled;
    this.lastFirstT = firstT;

    if (this.display.length === 0 || this.display.length !== scaled.length) {
      this.display = scaled.map((point) => ({ x: point.x, y: point.y, price: point.price }));
      this.draw();
      return;
    }

    this.startAnimation();
  }

  destroy() {
    cancelAnimationFrame(this.rafId);
    this.resizeObserver.disconnect();
    this.canvas.remove();
  }

  private resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = this.container.clientWidth;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(HEIGHT * this.dpr);
    this.canvas.style.height = `${HEIGHT}px`;
    this.canvas.style.width = '100%';

    if (this.rawWindow.length > 0) {
      this.target = this.scale(this.rawWindow);
      this.display = this.target.map((point) => ({ x: point.x, y: point.y, price: point.price }));
    }

    this.draw();
  }

  private scale(history: GoldPricePoint[]): PlotPoint[] {
    const prices = history.map((point) => point.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || Math.max(max * 0.001, 1);
    const innerW = Math.max(this.width - PADDING.left - PADDING.right, 1);
    const innerH = HEIGHT - PADDING.top - PADDING.bottom;

    return history.map((point, index) => ({
      x: PADDING.left + (index / Math.max(history.length - 1, 1)) * innerW,
      y: PADDING.top + (1 - (point.price - min) / range) * innerH,
      price: point.price,
    }));
  }

  private startAnimation() {
    if (this.animating) return;
    this.animating = true;

    const frame = () => {
      let moving = false;

      for (let i = 0; i < this.display.length; i += 1) {
        const current = this.display[i];
        const goal = this.target[i];
        if (!goal) continue;

        const nextX = current.x + (goal.x - current.x) * LERP;
        const nextY = current.y + (goal.y - current.y) * LERP;
        current.x = nextX;
        current.y = nextY;
        current.price = goal.price;

        if (Math.abs(goal.x - nextX) > 0.4 || Math.abs(goal.y - nextY) > 0.4) moving = true;
      }

      this.draw();

      if (moving) {
        this.rafId = requestAnimationFrame(frame);
      } else {
        this.animating = false;
      }
    };

    this.rafId = requestAnimationFrame(frame);
  }

  private draw() {
    const { ctx } = this;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, HEIGHT);

    this.drawGrid();
    if (this.display.length < 2) return;

    this.fillAreaUnder(this.display);
    this.strokeCurve(this.display);
    this.drawLastPoint(this.display[this.display.length - 1]);
  }

  private drawGrid() {
    const { ctx } = this;
    ctx.save();
    ctx.strokeStyle = '#e8e5df';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);

    for (const ratio of [0.25, 0.5, 0.75]) {
      const y = PADDING.top + (HEIGHT - PADDING.top - PADDING.bottom) * ratio;
      ctx.beginPath();
      ctx.moveTo(PADDING.left, y);
      ctx.lineTo(this.width - PADDING.right, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  private fillAreaUnder(points: PlotPoint[]) {
    const { ctx } = this;
    const first = points[0];
    const last = points[points.length - 1];
    const bottom = HEIGHT - PADDING.bottom;

    ctx.beginPath();
    ctx.moveTo(first.x, bottom);
    ctx.lineTo(first.x, first.y);
    this.traceCurve(ctx, points);
    ctx.lineTo(last.x, bottom);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, PADDING.top, 0, bottom);
    gradient.addColorStop(0, 'rgba(212, 175, 55, 0.28)');
    gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

    ctx.fillStyle = gradient;
    ctx.fill();
  }

  private strokeCurve(points: PlotPoint[]) {
    const { ctx } = this;
    const gradient = ctx.createLinearGradient(PADDING.left, 0, this.width - PADDING.right, 0);
    gradient.addColorStop(0, '#e6c65c');
    gradient.addColorStop(0.55, '#d4af37');
    gradient.addColorStop(1, '#a97c17');

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    this.traceCurve(ctx, points);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  private traceCurve(target: CanvasRenderingContext2D, points: PlotPoint[]) {
    for (let i = 0; i < points.length - 1; i += 1) {
      const previous = points[i - 1] ?? points[i];
      const current = points[i];
      const next = points[i + 1];
      const afterNext = points[i + 2] ?? next;

      const c1x = current.x + (next.x - previous.x) / 6;
      const c1y = current.y + (next.y - previous.y) / 6;
      const c2x = next.x - (afterNext.x - current.x) / 6;
      const c2y = next.y - (afterNext.y - current.y) / 6;

      target.bezierCurveTo(c1x, c1y, c2x, c2y, next.x, next.y);
    }
  }

  private drawLastPoint(point: PlotPoint) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 197, 66, 0.25)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(point.x, point.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#d4af37';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
