import { Injectable } from '@angular/core';
import {Project} from '../../models/project';
import {Observable, of, ReplaySubject, Subject} from 'rxjs';
import {Action} from '../../models/action';
import {ProjectSaveManagementService} from '../project-save-management/project-save-management.service';
import {delayWhen} from 'rxjs/operators';
import {WorkArea} from '../../models/rendering/work-area';

@Injectable({
	providedIn: 'root'
})
export class ProjectsService {

	public static staticInstance: ProjectsService;

	private _projects: Map<number, Project> = new Map<number, Project>();
	private _currProject: Project;

	private _mainProject: Project;

	private _currentlyOpening: number[] = [];

	private _projectOpenedSubject = new ReplaySubject<number>();
	private _projectClosedSubject = new Subject<number>();

	constructor(private projectSaveManagementService: ProjectSaveManagementService) {
		ProjectsService.staticInstance = this;

		this.projectSaveManagementService.getProjectToOpenOnLoad().then(project => {
			this._projects.set(project.id, project);
			this._currProject = project;
			this._mainProject = project;
			this._projectOpenedSubject.next(project.id);
		});
	}

	public get mainProject(): Project {
		return this._mainProject;
	}

	public async openComponent(id: number) {
		if (this.allProjects.has(id) || this._currentlyOpening.includes(id)) return;
		this._currentlyOpening.push(id);
		const proj = await this.projectSaveManagementService.openComponent(id);
		if (!proj) {
			this._currentlyOpening = this._currentlyOpening.filter(o => id !== o);
			return;
		}
		this._projects.set(id, proj);
		this._projectOpenedSubject.next(id);
		this._currentlyOpening = this._currentlyOpening.filter(o => id !== o);
	}

	public openFile(content: string) {
		const project = this.projectSaveManagementService.openFromFile(content);
		if (!project) return;
		this.allProjects.forEach((value, key) => this.closeProject(key));
		this._projects.set(project.id, project);
		this._currProject = project;
		this._mainProject = project;
		this._projectOpenedSubject.next(project.id);
	}

	public onProjectChanges$(projectId: number): Observable<Action[]> {
		return this._projects.get(projectId).changes;
	}

	public get onProjectOpened$(): Observable<number> {
		return this._projectOpenedSubject.asObservable().pipe(
			delayWhen((value, index) => {
				if (index === 0) {
					return WorkArea.pixiFontLoaded$;
				}
				return of(undefined);
			})
		);
	}

	public get onProjectClosed$(): Observable<number> {
		return this._projectClosedSubject.asObservable();
	}

	public switchToProject(id: number): void {
		this._currProject = this._projects.get(id);
	}

	public get currProject(): Project {
		return this._currProject;
	}

	public get allProjects(): Map<number, Project> {
		return this._projects;
	}

	public closeProject(id: number) {
		this._projectClosedSubject.next(id);
		this._projects.delete(id);
	}

	public saveAll() {
		this.projectSaveManagementService.saveProjects(Array.from(this.allProjects.values()));
	}
}
