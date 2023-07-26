import { randomChance } from "../helpers/math";
import { randomShape } from "../helpers/shape";
import Background from "../types/background";
import { Vec2 } from "../types/math";
import Shape from "../types/shape";

export class RandomShapeBackground extends Background {
	shapes: { shape: Shape, life: number, position: Vec2 }[] = [];

	doTick(ctx: CanvasRenderingContext2D, ellapsed: number) {
		if (this.shapes.length < 10 && randomChance(0.025)) {
			let position: Vec2;
			do {
				position = new Vec2(ctx.canvas.width, ctx.canvas.height).scale(Math.random(), Math.random());
			} while (this.shapes.find(s => s.position.distanceToSqr(position) < Math.pow(s.shape.size * 2 * ctx.canvas.width * 0.05, 2)));
			const shape = randomShape();
			//if (shape.color.isDark()) shape.color = shape.color.brighten(50);
			this.shapes.push({ shape, life: 3000, position });
		}

		this.shapes = this.shapes.map(s => {
			s.life -= ellapsed;
			return s;
		}).filter(s => s.life > 0);
	}

	doRender(ctx: CanvasRenderingContext2D) {
		this.shapes.forEach(s => {
			var opacity: number;
			if (s.life > 2000) opacity = (1000 - (s.life % 1000)) / 1000;
			else if (s.life > 1000) opacity = 1;
			else opacity = Math.max(0, s.life) / 1000;
			ctx.globalAlpha = opacity;
			s.shape.render(ctx, s.position, false);
		});
		ctx.globalAlpha = 1;
	}
}