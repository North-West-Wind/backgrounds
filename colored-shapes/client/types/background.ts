export default abstract class Background {
	lastTime = 0;

	render(ctx: CanvasRenderingContext2D) {
		const now = Date.now();
		if (!this.lastTime) this.lastTime = now;
		this.doTick(ctx, now - this.lastTime);
		this.lastTime = now;

		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		this.doRender(ctx);
	}

	abstract doTick(ctx: CanvasRenderingContext2D, ellapsed: number): void;

	abstract doRender(ctx: CanvasRenderingContext2D): void;
}