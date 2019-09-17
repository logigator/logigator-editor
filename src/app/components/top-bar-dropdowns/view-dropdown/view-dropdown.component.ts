import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProjectInteractionService} from "../../../services/project-interaction/project-interaction.service";

@Component({
	selector: 'app-view-dropdown',
	templateUrl: './view-dropdown.component.html',
	styleUrls: ['../top-bar-dropdowns.scss', './view-dropdown.component.scss']
})
export class ViewDropdownComponent implements OnInit {

	@Output()
	public requestClosed: EventEmitter<any> = new EventEmitter();

	constructor(private projectInteractions: ProjectInteractionService) { }

	ngOnInit() {
	}

	public close() {
		this.requestClosed.emit();
	}

	public zoomIn() {
		this.projectInteractions.zoomIn();
		this.close();
	}

	public zoomOut() {
		this.projectInteractions.zoomOut();
		this.close();
	}
}
