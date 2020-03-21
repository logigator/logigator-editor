import {ElementType} from '../element-type';
import {ElementTypeId} from '../element-type-ids';

export const ledMatrix: ElementType = {
	id: ElementTypeId.LED_MATRIX,

	name: 'ELEMENT_TYPE.IO.LED_MATRIX.NAME',

	category: 'io',

	symbol: 'LED_M',

	showSettings: true,
	showSettingsForType: true,
	showInConstructionBox: true,

	description: 'ELEMENT_TYPE.IO.LED_MATRIX.DESCRIPTION',

	isRotatable: true,
	rotation: 0,

	numOutputs: 0,

	numInputs: 2,
	minInputs: 2,
	maxInputs: 2,

	width(element?) {
		return element?.options ? element.options[0] : this.options[0];

	},
	height(element?) {
		return element?.options ? element.options[1] : this.options[1];
	},

	options: [4, 4],
	optionsConfig: [
		{
			name: 'ELEMENT_TYPE.IO.LED_MATRIX.WIDTH',
			min: 2,
			max: 24
		},
		{
			name: 'ELEMENT_TYPE.IO.LED_MATRIX.HEIGHT',
			min: 2,
			max: 24
		}
	],

};
