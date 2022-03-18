import { IWindow } from '@aurelia/runtime-html';
import { IAureliaConfigurationOptions } from './AureliaConfigurationOptions';


export class UrlFactory {
	static create(win: IWindow, settings: IAureliaConfigurationOptions): string {
		return win.location.protocol + `/${settings.dir}/${settings.file}`;
	}
}
