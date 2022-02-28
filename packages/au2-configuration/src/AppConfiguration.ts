import { IContainer, IRegistry, noop, DI, Registration } from '@aurelia/kernel';
import { AppTask } from '@aurelia/runtime-html';
import { IHttpClient } from '@aurelia/fetch-client';
import { IAppConfigurationSettings } from './AppConfigurationSettings';

export interface IAppConfiguration {
	get(key: string): any;
	init(): void | Promise<any>;
}

export const IAppConfiguration = DI.createInterface<IAppConfiguration>('IAppConfiguration');

export class AppConfiguration implements IAppConfiguration {
	private Config: any;

	constructor(@IHttpClient private http: IHttpClient, @IAppConfigurationSettings private settings: IAppConfigurationSettings) {
	}

	public static register(container: IContainer): void {
		container.register(Registration.singleton(IAppConfiguration, this));
		container.register(
			AppTask.beforeCreate(IAppConfiguration, async plugin => {
				await plugin.init();
			}));
	}

	async get(key: string) {
		return this.getDictValue(this.Config, key);
	}

	async init() {
		let loc = window.location;
		var fileUrl = loc.protocol + `/${this.settings.dir}/${this.settings.file}`;
		let resp = await this.http.fetch(fileUrl);
		this.Config = await resp.json();
	}

	getDictValue(baseObject: {} | any, key: string) {
		let splitKey = key.split('.');
		let currentObject = baseObject;

		splitKey.forEach(key => {
			if (currentObject[key]) {
				currentObject = currentObject[key];
			} else {
				throw 'Key ' + key + ' not found';
			}
		});
		return currentObject;
	}
}