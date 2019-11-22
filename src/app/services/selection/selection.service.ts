import {Injectable, NgZone} from '@angular/core';
import {Project} from '../../models/project';
import {ProjectsService} from '../projects/projects.service';
import {CollisionFunctions} from '../../models/collision-functions';
import * as PIXI from 'pixi.js';
import {Elements} from '../../models/elements';
import {Action} from '../../models/action';

@Injectable({
	providedIn: 'root'
})
export class SelectionService {

	private _selectedIds: Map<number, number[]> = new Map<number, number[]>();
	private _selectedConnections: Map<number, PIXI.Point[]> = new Map<number, PIXI.Point[]>();

	constructor(private projectsService: ProjectsService, private ngZone: NgZone) {}

	public selectFromRect(project: Project, start: PIXI.Point, end: PIXI.Point): number[] {
		return this.ngZone.run(() => {
			this.clearForSelect(project, start, end);
			const ids = this._selectedIds.get(project.id);
			const cons = this._selectedConnections.get(project.id);
			const possibleChunkCoords = CollisionFunctions.inRectChunks(start, end);
			for (const chunk of project.currState.chunksFromCoords(possibleChunkCoords)) {
				for (const elem of chunk.elements) {
					if (CollisionFunctions.isElementInFloatRect(elem, start, end)) {
						if (!ids.find(id => id === elem.id))
							ids.push(elem.id);
					}
				}
				for (const con of chunk.connectionPoints) {
					if (CollisionFunctions.isRectInRectLightBorder(con, con, start, end)) {
						if (!cons.find(c => c.equals(con)))
							cons.push(con);
					}
				}
			}
			return ids;
		});
	}

	public cutFromRect(project: Project, start: PIXI.Point, end: PIXI.Point): Action[] {
		return this.ngZone.run(() => {
			this.clearForSelect(project, start, end);
			const out: Action[] = [];
			const ids = this._selectedIds.get(project.id);
			const cons = this._selectedConnections.get(project.id);
			const possibleChunkCoords = CollisionFunctions.inRectChunks(start, end);
			for (const chunk of project.currState.chunksFromCoords(possibleChunkCoords)) {
				for (const elem of chunk.elements) {
					if (elem.typeId === 0) {
						this.splitAndSelectWire(elem, start, end, ids, project, out);
					} else {
						if (CollisionFunctions.isRectOnRect(elem.pos, elem.endPos, start, end)) {
							if (!ids.find(id => id === elem.id))
								ids.push(elem.id);
						}
					}
				}
				for (const con of chunk.connectionPoints) {
					if (CollisionFunctions.isRectInRectLightBorder(con, con, start, end)) {
						if (!cons.find(c => c.equals(con)))
							cons.push(con);
					}
				}
			}

			return out;
		});
	}

	private splitAndSelectWire(elem, start: PIXI.Point, end: PIXI.Point, ids, project: Project, out: Action[]) {
		const cuttingPos = CollisionFunctions.rectCuttingPoint(elem, start, end);
		console.log(cuttingPos);
		if (cuttingPos === undefined)
			return;
		if (cuttingPos === null) {
			if (!ids.find(id => id === elem.id))
				ids.push(elem.id);
			return;
		}
		const splitted = project.splitWire(elem, cuttingPos);
		for (const e of splitted.elements) {
			if (CollisionFunctions.isElementInFloatRect(elem, start, end)) {
				if (!ids.find(id => id === elem.id))
					ids.push(elem.id);
			}
		}
		out.push(...splitted.actions);
	}

	private clearForSelect(project: Project, start: PIXI.Point, end: PIXI.Point) {
		Elements.correctPosOrder(start, end);
		this._selectedIds.set(project.id, []);
		this._selectedConnections.set(project.id, []);
	}

	public selectComponent(id: number, projectId?: number): void {
		this.ngZone.run(() => {
			this._selectedIds.set(projectId === undefined ? this.projectsService.currProject.id : projectId, [id]);
		});
	}

	public isSingleSelect(projectId?: number): boolean {
		const id = projectId === undefined ? this.projectsService.currProject ? this.projectsService.currProject.id : projectId : projectId;
		if (this._selectedIds.has(id)) {
			return this._selectedIds.get(id).length === 1;
		}
		return false;
}

	public selectedIds(projectId?: number): number[] {
		const id = projectId === undefined ? this.projectsService.currProject ? this.projectsService.currProject.id : projectId : projectId;
		if (this._selectedIds.has(id)) {
			return this._selectedIds.get(id);
		}
		return [];
	}

	public selectedConnections(projectId?: number): PIXI.Point[] {
		const id = projectId === undefined ? this.projectsService.currProject ? this.projectsService.currProject.id : projectId : projectId;
		if (this._selectedConnections.has(id)) {
			return this._selectedConnections.get(id);
		}
		return [];
	}

	public clearSelection(projectId?: number) {
		this.ngZone.run(() => {
			this._selectedIds.delete(projectId === undefined ? this.projectsService.currProject.id : projectId);
			this._selectedConnections.delete(projectId === undefined ? this.projectsService.currProject.id : projectId);
		});

	}
}
