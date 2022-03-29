import { HttpClientConfiguration } from '@aurelia/fetch-client';
import { IRest } from './Rest';
import { IContainer, Registration, DI } from '@aurelia/kernel';
import { AppTask } from '@aurelia/runtime-html';
import { IAureliaConfiguration } from '@starnetbih/au2-configuration';
import { IRestFactory } from 'RestFactory';


/**
* ApiEndpoints class. Configures and stores endpoints
*/
export interface IApiEndpoints {
	registerEndpoint(name: string, url: string): IApiEndpoints;
	registerEndpointUsingCallback(name: string, configureCb: (settings: HttpClientConfiguration) => HttpClientConfiguration, defaults?: RequestInit): IApiEndpoints;
	getEndpoint(name: string): IRest;

}

export const IApiEndpoints = DI.createInterface<IApiEndpoints>('IApiEndpoints');

export class ApiEndpoints implements IApiEndpoints {
	endpoints: Map<string, IRest>;

	constructor(@IRestFactory private RestFactory : IRestFactory) {
		this.endpoints = new Map<string, IRest>();
	}

	getEndpoint(name: string): IRest {
		return this.endpoints.get(name);
	}

	registerEndpoint(name: string, url: string, defaults?: RequestInit): IApiEndpoints {
		const rest = this.RestFactory.create(name, url, defaults);
		this.endpoints.set(name, rest);
		return this;
	}

	registerEndpointUsingCallback(name: string, configureCb: (settings: HttpClientConfiguration) => HttpClientConfiguration, defaults?: RequestInit): IApiEndpoints {
		const rest = this.RestFactory.createUsingCallback(name, configureCb, defaults);
		this.endpoints.set(name, rest);
		return this;
	}

	public static register(container: IContainer): void {
		container.register(Registration.singleton(IApiEndpoints, this));
		container.register(
			AppTask.beforeActivate(IApiEndpoints, async plugin => {
				await ApiEndpoints.RegisterFromConfigFile(container, plugin);
			}));
	}

	private static async RegisterFromConfigFile(container: IContainer, plugin: IApiEndpoints) {
		const cfgProvider = container.get(IAureliaConfiguration);
		const cnf = await cfgProvider.get('au2-api');
		if (cnf) {
			for (const key of Object.keys(cnf)) {
				plugin.registerEndpoint(key, cnf[key].url);
			}
		}
	}
}