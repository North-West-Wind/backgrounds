import Trapezium from "./trapezium";

export default class Rectangle extends Trapezium {
	static readonly TYPE = "rectangle";
	type = Rectangle.TYPE;

	constructor(color: tinycolor.ColorInput, rotation: number, size: number, height: number) {
		super(color, rotation, size, height, 1, 1);
	}
}