import Shape from "../types/shape";

export default class Trapezium extends Shape {
	static TYPE = "trapezium";
	type = Trapezium.TYPE;
	upLength: number;
	downLength: number;

	constructor(color: tinycolor.ColorInput, rotation: number, size: number, height: number, upLength: number, downLength: number) {
		super(color, rotation, size, height);
		this.upLength = upLength;
		this.downLength = downLength;
	}

	doRender(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.moveTo(-this.downLength * 0.5, this.height * 0.5);
		ctx.lineTo(this.downLength * 0.5, this.height * 0.5);
		ctx.lineTo(this.upLength * 0.5, -this.height * 0.5);
		ctx.lineTo(-this.upLength * 0.5, -this.height * 0.5);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}