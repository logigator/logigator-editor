import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {EditorColorKey, EditorColors, Theme} from '../../models/theming';
import {Observable, Subject} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ThemingService {

	public static staticInstance: ThemingService;

	private _currentTheme: Theme;

	private _requestFullscreenSubject = new Subject<void>();

	private _editorColor: EditorColors = {
		light: {
			background: 0xF5F5F5,
			grid: 0x248945,
			wire: 0x2ED573,
			selectRect: 0,
			fontTint: 0
		},
		dark: {
			background: 0x2B2B2B,
			grid: 0x1C8045,
			wire: 0x27AE60,
			selectRect: 0,
			fontTint: 0xFFFFFF
		}
	};

	constructor(@Inject(DOCUMENT) private document: HTMLDocument) {
		ThemingService.staticInstance = this;
		this.loadTheme();
	}

	private loadTheme() {
		this._currentTheme = (localStorage.getItem('theme') || 'dark') as Theme;
	}

	public setTheme(theme: Theme) {
		localStorage.setItem('theme', theme);
	}

	public get themeClass(): string {
		return 'theme-' + this._currentTheme;
	}

	public getEditorColor(key: EditorColorKey): number {
		return this._editorColor[this._currentTheme][key];
	}

	public get currentTheme(): Theme {
		return this._currentTheme;
	}

	public get pendingTheme(): Theme {
		return (localStorage.getItem('theme') || 'dark') as Theme;
	}

	public requestFullscreen() {
		this._requestFullscreenSubject.next();
	}

	public get onRequestFullscreen$(): Observable<void> {
		return this._requestFullscreenSubject.asObservable();
	}
}
