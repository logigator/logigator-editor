import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Optional, Output} from '@angular/core';
import {ThemingService} from '../../../services/theming/theming.service';
import {ShortcutConfigComponent} from '../../popup-contents/shortcut-config/shortcut-config/shortcut-config.component';
import {ReloadQuestionComponent} from '../../popup-contents/relaod-question/reload-question.component';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from '../../../services/user/user.service';
import {ProjectsService} from '../../../services/projects/projects.service';
import {ElectronService} from 'ngx-electron';
import {PopupService} from '@logigator/logigator-shared-comps';
import {Observable} from 'rxjs';
import {ElectronUpdateService} from '../../../services/electron-update/electron-update.service';

@Component({
	selector: 'app-settings-dropdown',
	templateUrl: './settings-dropdown.component.html',
	styleUrls: ['./settings-dropdown.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsDropdownComponent implements OnInit {

	@Output()
	public requestClosed: EventEmitter<any> = new EventEmitter();

	public showDropDown = true;
	public currentLang: string;

	public isNewVersionAvailable$: Observable<boolean>;

	constructor(
		public theming: ThemingService,
		private popupService: PopupService,
		private translation: TranslateService,
		private user: UserService,
		private projects: ProjectsService,
		@Optional() private electronUpdateService: ElectronUpdateService,
		@Optional() private electronService: ElectronService
	) {}

	ngOnInit(): void {
		this.currentLang = this.translation.currentLang;

		// #!electron
		this.isNewVersionAvailable$ = this.electronUpdateService.isNewVersionAvailable$;
	}

	public get isLoggedIn(): boolean {
		return this.user.isLoggedIn;
	}

	public languageChange() {
		this.translation.use(this.currentLang);
	}

	public close() {
		this.requestClosed.emit();
	}

	public async showCustomizeShortcuts() {
		this.showDropDown = false;
		await this.popupService.showPopup(ShortcutConfigComponent, 'POPUP.SHORTCUTS.TITLE', false);
		this.close();
	}

	public accountSettings() {
		// #!web
		window.open('https://logigator.com/my/settings', '_blank');
		// #!electron
		this.electronService.shell.openExternal('https://logigator.com/my/settings');
	}

	public privacyPolicy() {
		// #!web
		window.open('https://logigator.com/privacy-policy', '_blank');
		// #!electron
		this.electronService.shell.openExternal('https://logigator.com/privacy-policy');
	}

	// #! ELECTRON === 'true'
	public async logout() {
		if (await this.projects.askToSave()) {
			this.user.logout();
			this.projects.newProject();
		}
		this.close();
	}

	updateClick() {
		this.electronService.shell.openExternal('https://logigator.com/download');
	}
	// #!endif

	public async showReloadPopup() {
		this.showDropDown = false;
		await this.popupService.showPopup(ReloadQuestionComponent, 'POPUP.RELOAD.TITLE', false);
		this.close();
	}
}
