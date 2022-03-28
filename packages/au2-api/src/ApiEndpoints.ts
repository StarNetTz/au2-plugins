import { HttpClient, HttpClientConfiguration } from '@aurelia/fetch-client';
import { IRest, Rest } from './Rest';
import { IContainer, Registration, DI } from '@aurelia/kernel';
import { AppTask } from '@aurelia/runtime-html';
import { IAureliaConfiguration } from '@starnetbih/au2-configuration';


/**
* ApiRegistry class. Configures and stores endpoints
*/
export interface IApiEndpoints {
	registerEndpoint(name: string, url: string): IApiEndpoints;
	getEndpoint(name: string): IRest;

}

export const IApiEndpoints = DI.createInterface<IApiEndpoints>('IApiEndpoints');

export class ApiEndpoints implements IApiEndpoints {
	endpoints: Map<string, IRest>;

	defaults : RequestInit = {
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
	};

	constructor() {
		this.endpoints = new Map<string, IRest>();
	}

	getEndpoint(name: string): IRest {
		return this.endpoints.get(name);
	}

	registerEndpoint(name: string, url: string): IApiEndpoints {
		const cli = this.CreateHttpClient(url);
		const rest = new Rest(cli, name);
		this.endpoints.set(name, rest);
		return this;
	}

		private CreateHttpClient(url: string) {
			return new HttpClient().
				configure(x => x
					.withBaseUrl(url)
					.withDefaults(this.defaults)
				);
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