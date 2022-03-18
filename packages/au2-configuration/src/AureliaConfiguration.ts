import { DI } from '@aurelia/kernel';
import { IWindow } from '@aurelia/runtime-html';
import { IHttpClient } from '@aurelia/fetch-client';
import { IAureliaConfigurationOptions } from './AureliaConfigurationOptions';
import { UrlFactory } from 'UrlFactory';

export interface IAureliaConfiguration {
	get(key: string): object;
	init(): Promise<void> | Promise<object>;
}

export const IAureliaConfiguration = DI.createInterface<IAureliaConfiguration>('IAureliaConfiguration');

export class AureliaConfiguration implements IAureliaConfiguration {

	private Config: object;

	constructor(
		@IHttpClient private http: IHttpClient,
		@IAureliaConfigurationOptions private settings: IAureliaConfigurationOptions,
		@IWindow private win: IWindow
	) { }

	async get(key: string) {
		return this.getDictValue(this.Config, key);
	}

	async init() {
		const resp = await this.http.fetch(UrlFactory.create(this.win, this.settings));
		this.Config = await resp.json();
	}

	getDictValue(baseObject: object, key: string) {
		const splitKey = key.split('.');
		let currentObject = baseObject;

		splitKey.forEach(key => {
			if (currentObject[key]) {
				currentObject = currentObject[key];
			} else {
				throw new Error('Key ' + key + ' not found');
			}
		});
		return currentObject;
	}
}