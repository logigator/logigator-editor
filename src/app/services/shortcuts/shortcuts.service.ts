import { Injectable } from '@angular/core';
import {defaultShortcuts} from './default-shortcuts';
import {ShortcutAction, ShortcutMap} from '../../models/shortcut-map';
import {WorkModeService} from '../work-mode/work-mode.service';
import {ProjectInteractionService} from '../project-interaction/project-interaction.service';
import {ProjectsService} from '../projects/projects.service';

@Injectable({
	providedIn: 'root'
})
export class ShortcutsService {

	// config could be loaded
	private _shortcutMap: ShortcutMap = defaultShortcuts;

	constructor(
		private workMode: WorkModeService,
		private projectInteraction: ProjectInteractionService,
		private projects: ProjectsService
	) { }

	public eventListener(e: KeyboardEvent) {
		const action = this.getShortcutActionFromEvent(e);
		if (!action) return;
		this.applyAction(action);
	}

	private getShortcutActionFromEvent(e: KeyboardEvent): ShortcutAction | null {
		for (const action: ShortcutAction in this._shortcutMap) {
			const shortcutConfig = this._shortcutMap[action];
			if (shortcutConfig &&
				e.code === shortcutConfig.keyCode &&
				e.shiftKey === !!shortcutConfig.shift &&
				e.ctrlKey === !!shortcutConfig.ctrl &&
				e.altKey === !!shortcutConfig.alt
			) {
				return action;
			}
		}
		return null;
	}

	private applyAction(action: ShortcutAction) {
		switch (action) {
			case 'wireMode':
				this.workMode.setWorkMode('buildWire');
				break;
			case 'connWireMode':
				this.workMode.setWorkMode('connectWire');
				break;
			case 'selectMode':
				this.workMode.setWorkMode('select');
				break;
			case 'textMode':
				break;
			case 'delete':
				this.projectInteraction.deleteSelection();
				break;
			case 'copy':
			case 'cut':
			case 'paste':
					break;
			case 'zoomIn':
				this.projectInteraction.zoomIn();
				break;
			case 'zoomOut':
				this.projectInteraction.zoomOut();
				break;
			case 'zoom100':
				this.projectInteraction.zoom100();
				break;
			case 'undo':
				this.projects.currProject.stepBack();
				break;
			case 'redo':
				this.projects.currProject.stepForward();
				break;
		}
	}
}