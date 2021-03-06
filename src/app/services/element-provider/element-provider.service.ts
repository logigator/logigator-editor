import {Injectable} from '@angular/core';
import {wire} from '../../models/element-types/basic/wire';
import {not} from '../../models/element-types/basic/not';
import {and} from '../../models/element-types/basic/and';
import {or} from '../../models/element-types/basic/or';
import {xor} from '../../models/element-types/basic/xor';
import {input} from '../../models/element-types/plug/input';
import {output} from '../../models/element-types/plug/output';
import {button} from '../../models/element-types/io/button';
import {lever} from '../../models/element-types/io/lever';
import {butt} from '../../models/element-types/plug/butt';
import {ErrorHandlingService} from '../error-handling/error-handling.service';
import {ElementType} from '../../models/element-types/element-type';
import {delay} from '../../models/element-types/basic/delay';
import {clock} from '../../models/element-types/basic/clock';
import {halfAdder} from '../../models/element-types/advanced/half-adder';
import {fullAdder} from '../../models/element-types/advanced/full-adder';
import {text} from '../../models/element-types/basic/text';
import {ElementTypeId} from '../../models/element-types/element-type-ids';
import {udcTemplate} from '../../models/element-types/udc-template';
import {rom} from '../../models/element-types/advanced/rom';
import {dFF} from '../../models/element-types/advanced/d-ff';
import {jkFF} from '../../models/element-types/advanced/jk-ff';
import {srFF} from '../../models/element-types/advanced/sr-ff';
import {led} from '../../models/element-types/io/led';
import {segmentDisplay} from '../../models/element-types/io/segment-display';
import {ledMatrix} from '../../models/element-types/io/led-matrix';
import {tunnel} from '../../models/element-types/basic/tunnel';

@Injectable({
	providedIn: 'root'
})
export class ElementProviderService {

	private _basicElements: Map<number, ElementType> = new Map([
		[wire.id, wire],
		[not.id, not],
		[and.id, and],
		[or.id, or],
		[xor.id, xor],
		[delay.id, delay],
		[clock.id, clock],
		[text.id, text],
		[tunnel.id, tunnel]
	]);

	private _advancedElements: Map<number, ElementType> = new Map([
		[halfAdder.id, halfAdder],
		[fullAdder.id, fullAdder],
		[rom.id, rom],
		[dFF.id, dFF],
		[jkFF.id, jkFF],
		[srFF.id, srFF]
	]);

	private _plugElements: Map<number, ElementType> = new Map([
		[input.id, input],
		[output.id, output],
		[butt.id, butt]
	]);

	private _ioElements: Map<number, ElementType> = new Map([
		[button.id, button],
		[lever.id, lever],
		[led.id, led],
		[segmentDisplay.id, segmentDisplay],
		[ledMatrix.id, ledMatrix]
	]);

	private _userDefinedElements: Map<number, ElementType> = new Map<number, ElementType>();

	constructor(private errorHandler: ErrorHandlingService) {}

	public static isCompileElement(id: number): boolean {
		return !(id === ElementTypeId.WIRE || id === ElementTypeId.BUTT || id === ElementTypeId.TEXT || id === ElementTypeId.TUNNEL);
	}

	public setUserDefinedTypes(elements: Map<number, Partial<ElementType>>) {
		for (const [id, elem] of elements) {
			this.addUserDefinedElement(elem, id);
		}
	}

	public addUserDefinedElement(element: Partial<ElementType>, id: number) {
		this._userDefinedElements.set(id, {...udcTemplate, ...element} as ElementType);
	}

	public clearElementsFromFile() {
		for (const key of this.userDefinedElements.keys()) {
			if (key < 1000 && key >= 500) this.userDefinedElements.delete(key);
		}
	}

	public clearUserDefinedElements() {
		for (const key of this.userDefinedElements.keys()) {
			if (key >= 1000) this.userDefinedElements.delete(key);
		}
	}

	public getElementById(id: number): ElementType {
		if (this._basicElements.has(id)) {
			return this._basicElements.get(id);
		} else if (this._advancedElements.has(id)) {
			return this._advancedElements.get(id);
		} else if (this._plugElements.has(id)) {
			return this._plugElements.get(id);
		} else if (this._ioElements.has(id)) {
			return this._ioElements.get(id);
		} else if (this._userDefinedElements.has(id)) {
			return this._userDefinedElements.get(id);
		}
		this.errorHandler.showErrorMessage('ERROR.PROJECTS.COMP_NOT_FOUND');
	}

	public hasElement(id: number) {
		return this._basicElements.has(id) ||
			this._advancedElements.has(id) ||
			this._plugElements.has(id) ||
			this._ioElements.has(id) ||
			this._userDefinedElements.has(id);
	}

	public isIoElement(id: number): boolean {
		return this._ioElements.has(id);
	}

	public isPlugElement(id: number): boolean {
		return this._plugElements.has(id);
	}

	public isUserElement(id: number): boolean {
		return this._userDefinedElements.has(id);
	}

	public get basicElements(): Map<number, ElementType> {
		return this._basicElements;
	}

	get advancedElements(): Map<number, ElementType> {
		return this._advancedElements;
	}

	public get plugElements(): Map<number, ElementType> {
		return this._plugElements;
	}

	public get ioElements(): Map<number, ElementType> {
		return this._ioElements;
	}

	public get userDefinedElements(): Map<number, ElementType> {
		return this._userDefinedElements;
	}
}
