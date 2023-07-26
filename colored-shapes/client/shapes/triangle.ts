import Trapezium from "./trapezium";

export default class Triangle extends Trapezium {
	static readonly TYPE = "triangle";
	type = Triangle.TYPE;

	constructor(color: tinycolor.ColorInput, rotation: number, size: number, height: number) {
		super(color, rotation, size, height, 0, 1.15470053838);
	}
}