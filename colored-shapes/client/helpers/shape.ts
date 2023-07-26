import Circle from "../shapes/circle";
import Empty from "../shapes/empty";
import Polygon from "../shapes/polygon";
import Rectangle from "../shapes/rectangle";
import Trapezium from "../shapes/trapezium";
import Triangle from "../shapes/triangle";
import Shape from "../types/shape";
import { randomBetween } from "./math";

export function randomShape(colorRange: number[] = []) {
	const color = randomBetween(colorRange[0] || 0, colorRange[1] || 16777216, true).toString(16);
	const rotation = Math.PI * 2 * Math.random();
	const size = randomBetween(0.75, 2);
	const height = 1;
	switch (Math.floor(Math.random() * 5)) {
		case 0: return new Circle(color, rotation, size, height);
		case 1: return new Trapezium(color, rotation, size, height, randomBetween(0.5, 1.25), randomBetween(0.75, 2));
		case 2: return new Rectangle(color, rotation, size, height);
		case 3: return new Triangle(color, rotation, size, height);
		case 4: return new Polygon(color, rotation, size, randomBetween(5, 8, true));
		default: return new Empty();
	}
}

export function copyShape(type: string, shape: Shape) {
	switch (type) {
		case Circle.TYPE:
			return new Circle(shape.color, shape.rotation, shape.size, shape.height);
		case Rectangle.TYPE:
			return new Rectangle(shape.color, shape.rotation, shape.size, shape.height);
		case Trapezium.TYPE:
			return new Trapezium(shape.color, shape.rotation, shape.size, shape.height, 1, 2);
		case Triangle.TYPE:
			return new Triangle(shape.color, shape.rotation, shape.size, shape.height);
		default:
			return new Empty();
	}
}