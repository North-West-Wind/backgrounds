import Shape from "../types/shape";

export default class Empty extends Shape {
	static readonly TYPE = "empty";
	type = Empty.TYPE;

	constructor() {
		super("0", 0, 0, 0);
	}

	doRender(_ctx: CanvasRenderingContext2D) { }
}