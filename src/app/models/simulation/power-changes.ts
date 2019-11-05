import { Element } from '../element';
import {InputEvent} from './board';

export interface PowerChangeIn {
	inputEvent: InputEvent;
	state: ArrayBuffer;
}
export type PowerChangesOutWire = Map<Element, boolean>;
export type PowerChangesOutWireEnd = Map<{component: Element, wireIndex: number}, boolean>;
