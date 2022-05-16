import { HttpClientConfiguration } from '@aurelia/fetch-client';
import { IRest } from './Rest';
import { IContainer, Registration, DI } from '@aurelia/kernel';
import { AppTask } from '@aurelia/runtime-html';
import { IAureliaConfiguration } from '@starnetbih/au2-configuration';
import { IRestFactory } from 'RestFactory';

export interface IApiEndpoints {
	register(name: string, url: string): IApiEndpoints;
	registerUsingCallback(name: string, configureCb: (settings: HttpClientConfiguration) => HttpClientConfiguration, defaults?: RequestInit): IApiEndpoints;
	get(name: string): IRest;

}

export const IApiEndpoints = DI.createInterface<IApiEndpoints>('IApiEndpoints');

export class ApiEndpoints implements IApiEndpoints {
	endpoints: Map<string, IRest>;

	constructor(@IRestFactory private RestFactory: IRestFactory) {
		this.endpoints = new Map<string, IRest>();
	}

	get(name: string): IRest {
		return this.endpoints.get(name);
	}

	register(name: string, url: string, defaults?: RequestInit): IApiEndpoints {
		const rest = this.RestFactory.create(name, url, defaults);
		this.endpoints.set(name, rest);
		return this;
	}

	registerUsingCallback(name: string, configureCb: (settings: HttpClientConfiguration) => HttpClientConfiguration, defaults?: RequestInit): IApiEndpoints {
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
				if (cnf[key].auth) {
					plugin.registerUsingCallback(key, (cfg) => {
						return cfg
							.withBaseUrl(cnf[key].url)
							.withInterceptor({
								request(request) {
									const tok = window.localStorage.getItem('jwt');
									if (tok) {
										request.headers.append('Authorization', tok);
									}
									return request;
								}
							})
					}, this.defaultAuthClientOptions);
				}
				else
					plugin.register(key, cnf[key].url);
			}
		}
	}

	static defaultAuthClientOptions: RequestInit = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		credentials: "include"
	};
}