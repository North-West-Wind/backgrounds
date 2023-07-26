import { Vec2 } from "../types/math";
import Shape from "../types/shape";

export default class Polygon extends Shape {
	static readonly TYPE = "polygon";
	type = Polygon.TYPE;
	sides: number;

	private centerAngle: number;

	constructor(color: tinycolor.ColorInput, rotation: number, size: number, sides: number) {
		super(color, rotation, size, 1);
		this.sides = sides;
		this.centerAngle = Math.PI * 2 / sides;
	}

	doRender(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		let vec = new Vec2(0, 0.5);
		ctx.moveTo(vec.x, vec.y);
		for (let ii = 1; ii < this.sides; ii++) {
			vec = vec.rotate(this.centerAngle);
			ctx.lineTo(vec.x, vec.y);
		}
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}