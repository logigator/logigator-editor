import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PopupContentComp} from '@logigator/logigator-shared-comps';
import {Element} from '../../../models/element';
import {RomData} from '../../../models/element-types/advanced/rom';

@Component({
	selector: 'app-rom-edit',
	templateUrl: './rom-edit.component.html',
	styleUrls: ['./rom-edit.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RomEditComponent extends PopupContentComp<Element> implements OnInit {

	@ViewChild('hexInput', {static: true})
	hexInput: ElementRef<HTMLTextAreaElement>;

	leftAddress = '00000000';

	private leftAddressCache = new Map<number, string>();

	private oldValue = '';

	selectionStart: number;
	selectionEnd: number;
	rows = 1;

	constructor() {
		super();
	}

	ngOnInit() {
		this.hexInput.nativeElement.value = '';

		if (!this.inputFromOpener.data) return;
		const raw = atob(this.inputFromOpener.data as RomData);
		let hex = '';
		for (let i = 0; i < raw.length; i++ ) {
			const _hex = raw.charCodeAt(i).toString(16).toUpperCase();
			hex += (_hex.length === 2 ? _hex : '0' + _hex) + ' ';

		}
		this.rows = Math.ceil(hex.length / 48) || 1;
		this.calcLeftAddresses(this.rows);
		this.hexInput.nativeElement.value = hex;
		this.oldValue = hex;
	}

	onInput(event: InputEvent) {
		this.selectionChange();

		let newValue = this.hexInput.nativeElement.value.toUpperCase();
		if (event.inputType.includes('insert') && !(/^[0-9A-F ]+$/.test(newValue))) {
			this.hexInput.nativeElement.value = this.oldValue;
			return;
		}

		newValue = newValue.replace(/ /g, '');

		const newLength = newValue.length;

		let newValueWithSpaces = '';
		for (let i = 0; i < newValue.length; i++) {
			newValueWithSpaces += newValue.charAt(i) + (i !== 0 && (i + 1) % 2 === 0 ? ' ' : '');
		}
		newValueWithSpaces = newValueWithSpaces.trimRight();

		let oldValueWithSpaces: string;

		if (newLength <= Math.ceil((this.inputFromOpener.options[0] * (2 ** this.inputFromOpener.options[1])) / 4)) {
			oldValueWithSpaces = this.hexInput.nativeElement.value;
			this.hexInput.nativeElement.value = newValueWithSpaces;
			this.oldValue = newValueWithSpaces;
		} else {
			this.hexInput.nativeElement.value = this.oldValue;
			return;
		}

		this.rows = Math.ceil(this.hexInput.nativeElement.value.length / 48) || 1;
		this.calcLeftAddresses(this.rows);

		if (newValueWithSpaces.length !== oldValueWithSpaces.length && !event.inputType.includes('delete')) {
			this.hexInput.nativeElement.selectionStart = this.selectionStart + 1;
			this.hexInput.nativeElement.selectionEnd = this.selectionEnd + 1;
		} else {
			this.hexInput.nativeElement.selectionStart = this.selectionStart;
			this.hexInput.nativeElement.selectionEnd = this.selectionEnd;
		}
	}

	private calcLeftAddresses(lineCount: number) {
		if (this.leftAddressCache.has(lineCount)) {
			this.leftAddress = this.leftAddressCache.get(lineCount);
		}

		let newLeftAddress = '';
		for (let i = 0; i < lineCount; i++) {
			let hexAddr = (i * 16).toString(16).toUpperCase();
			while (hexAddr.length < 8) hexAddr = '0' + hexAddr;
			newLeftAddress += hexAddr + '\n';
		}
		this.leftAddressCache.set(lineCount, newLeftAddress);
		this.leftAddress = newLeftAddress;
	}

	selectionChange() {
		this.selectionStart = this.hexInput.nativeElement.selectionStart;
		this.selectionEnd = this.hexInput.nativeElement.selectionEnd;
	}

	public cancel() {
		this.requestClose.emit(false);
	}

	public save() {
		const hex = this.hexInput.nativeElement.value.replace(/ /g, '');
		if (hex.length === 0) {
			this.requestClose.emit('');
			return;
		}

		const base64 = hex.match(/\w{2}/g).map((a) =>  {
			return String.fromCharCode(parseInt(a, 16));
		}).join('')
		this.requestClose.emit(btoa(base64));
	}

}
