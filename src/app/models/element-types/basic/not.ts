import {ElementType} from '../element-type';
import {environment} from '../../../../environments/environment';

export const not: ElementType = {
	name: 'ELEMENT_TYPE.BASIC.NOT.NAME',
	numInputs: 1,
	numOutputs: 1,
	minInputs: 1,
	maxInputs: 1,
	width: environment.componentWidth,
	symbol: '!',
	description: 'ELEMENT_TYPE.BASIC.NOT.DESCRIPTION',
	rotation: 0,
	category: 'basic'
};
