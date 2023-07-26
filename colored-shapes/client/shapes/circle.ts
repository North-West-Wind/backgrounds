import Shape from "../types/shape";

export default class Circle extends Shape {
	static readonly TYPE = "circle";
	type = Circle.TYPE;

	doRender(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.ellipse(0, 0, 0.5, 0.5 * this.height, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
	}
}