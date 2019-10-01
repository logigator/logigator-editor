import { Component, OnInit } from '@angular/core';
import {PopupContentComp} from '../popup-content-comp';
import {ProjectSaveManagementService} from '../../../../services/project-save-management/project-save-management.service';
import {Project} from '../../../../models/project';

@Component({
	selector: 'app-save-as',
	templateUrl: './save-as.component.html',
	styleUrls: ['./save-as.component.scss']
})
export class SaveAsComponent extends PopupContentComp<Project[]> implements OnInit {

	public projectName: string;

	constructor(private projectSaveManagement: ProjectSaveManagementService) {
		super();
	}

	ngOnInit() {
		this.projectName = this.inputFromOpener.find(p => p.type === 'project').name;
	}

	public async saveToServer() {
		const newProject = this.projectSaveManagement.saveAsNewProjectServer(this.inputFromOpener, this.projectName);
		this.requestClose.emit(newProject);
	}

	public exportProject() {
		this.projectSaveManagement.exportToFile(this.inputFromOpener, this.projectName);
	}

}
