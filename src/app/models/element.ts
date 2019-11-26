import * as PIXI from 'pixi.js';

export interface Element {
	id: number;
	typeId: number;

	numInputs: number;
	numOutputs: number;

	connections?: number[][];

	pos: PIXI.Point;
	endPos?: PIXI.Point;

	rotation?: number;

	plugIndex?: number;

	options?: number[];

	data?: unknown;
}
