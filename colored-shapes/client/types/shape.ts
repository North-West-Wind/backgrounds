import tinycolor from "tinycolor2";
import { Vec2 } from "./math";

export default abstract class Shape {
	type = "generic";
	color: tinycolor.Instance;
	rotation: number;
	size: number;
	height: number;

	constructor(color: tinycolor.ColorInput, rotation: number, size: number, height: number) {
		this.color = tinycolor(color);
		this.rotation = rotation;
		this.size = size;
		this.height = height;
	}

	preRender(ctx: CanvasRenderingContext2D, position: Vec2, flipped: boolean) {
		ctx.fillStyle = this.color.toHex8String();
		ctx.strokeStyle = "black";
		ctx.translate(position.x, position.y);
		ctx.rotate(this.rotation);
		const scale = ctx.canvas.width * 0.05;
		ctx.scale((flipped ? -this.size : this.size) * scale, this.size * scale);
		ctx.lineWidth = 0.1;
	}

	abstract doRender(ctx: CanvasRenderingContext2D): void;

	postRender(ctx: CanvasRenderingContext2D) {
		ctx.resetTransform();
	}

	render(ctx: CanvasRenderingContext2D, position: Vec2, flipped: boolean) {
		this.preRender(ctx, position, flipped);
		this.doRender(ctx);
		this.postRender(ctx);
	}
}