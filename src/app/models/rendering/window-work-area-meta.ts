import {Project} from '../project';

export interface WindowWorkAreaMeta {
	project?: Project;
	identifier?: string;
	showing?: boolean;
	zIndex?: number;
	parentNames?: string[];
	parentTypesIds?: number[];
}