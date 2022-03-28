import { HttpClient, HttpClientConfiguration } from '@aurelia/fetch-client';
import { Rest } from './Rest';
import { IContainer, Registration, DI } from '@aurelia/kernel';
import { AppTask } from '@aurelia/runtime-html';
import { IAureliaConfiguration } from '@starnetbih/au2-configuration';

export interface RestOptions {
	/**
	 * `true` to use the traditional URI template standard (RFC6570) when building
	 * query strings from criteria objects, `false` otherwise. Default is `false`.
	 * NOTE: maps to `useTraditionalUriTemplates` parameter on `Rest` constructor.
	 *
	 * @type {boolean}
	 */
	useTraditionalUriTemplates?: boolean;
}

/**
* ApiRegistry class. Configures and stores endpoints
*/
export interface IApiRegistry {
	registerEndpoint(name: string, configureMethod?: string | Function, defaults?: {}, restOptions?: RestOptions): IApiRegistry;
	getEndpoint(name?: string): Rest;
	endpointExists(name: string): boolean;
	setDefaultEndpoint(name: string): IApiRegistry;
	setDefaultBaseUrl(baseUrl: string): IApiRegistry;
	configure(config: { defaultEndpoint: string, defaultBaseUrl: string, endpoints: Array<{ name: string, endpoint: string, config: {}, default: boolean }> }): IApiRegistry;
	endpoints: { [key: string]: Rest };
	defaultEndpoint: Rest;
	defaultBaseUrl: string;
}

export const IApiRegistry = DI.createInterface<IApiRegistry>('IApiRegistry');

export class ApiRegistry implements IApiRegistry {

	endpoints: { [key: string]: Rest } = {};
	defaultEndpoint: Rest;
	defaultBaseUrl: string;

	registerEndpoint(name: string, configureMethod?: string | Function, defaults?: {}, restOptions?: RestOptions): IApiRegistry {
		const newClient = new HttpClient();
		let useTraditionalUriTemplates;

		if (restOptions !== undefined) {
			useTraditionalUriTemplates = restOptions.useTraditionalUriTemplates;
		}
		this.endpoints[name] = new Rest(newClient, name, useTraditionalUriTemplates);

		// set custom defaults to Rest
		if (defaults !== undefined) {
			this.endpoints[name].defaults = defaults;
		}

		// Manual configure of client.
		if (typeof configureMethod === 'function') {
			newClient.configure(
				(newClientConfig: HttpClientConfiguration) => {
					return configureMethod(
						newClientConfig.withDefaults(this.endpoints[name].defaults)
					);
				}
			);

			// transfer user defaults from http-client to endpoint
			this.endpoints[name].defaults = newClient.defaults;
			return this;
		}

		// Base url is self / current host.
		if (typeof configureMethod !== 'string' && !this.defaultBaseUrl) {
			return this;
		}

		if (this.defaultBaseUrl && typeof configureMethod !== 'string' && typeof configureMethod !== 'function') {
			newClient.configure(configure => {
				return configure.withBaseUrl(this.defaultBaseUrl);
			});

			return this;
		}

		// Base url is string. Configure.
		newClient.configure(configure => {
			return configure.withBaseUrl(configureMethod);
		});

		return this;
	}

	getEndpoint(name?: string): Rest {
		if (!name) {
			return this.defaultEndpoint || null;
		}
		return this.endpoints[name] || null;
	}

	public endpointExists(name: string): boolean {
		return !!this.endpoints[name];
	}

	public setDefaultEndpoint(name: string): IApiRegistry {
		this.defaultEndpoint = this.getEndpoint(name);
		return this;
	}

	public setDefaultBaseUrl(baseUrl: string): IApiRegistry {
		this.defaultBaseUrl = baseUrl;
		return this;
	}


	public configure(config: { defaultEndpoint: string, defaultBaseUrl: string, endpoints: Array<{ name: string, endpoint: string, config: {}, default: boolean }> }): IApiRegistry {
		if (config.defaultBaseUrl) {
			this.defaultBaseUrl = config.defaultBaseUrl;
		}

		config.endpoints.forEach(endpoint => {
			this.registerEndpoint(endpoint.name, endpoint.endpoint, endpoint.config);

			if (endpoint.default) {
				this.setDefaultEndpoint(endpoint.name);
			}
		});

		if (config.defaultEndpoint) {
			this.setDefaultEndpoint(config.defaultEndpoint);
		}

		return this;
	}

	public static register(container: IContainer): void {
		container.register(Registration.singleton(IApiRegistry, this));
		container.register(
			AppTask.beforeActivate(IApiRegistry, async plugin => {
				await ApiRegistry.RegisterFromConfigFile(container, plugin);
			}));
	}

	private static async RegisterFromConfigFile(container: IContainer, plugin: IApiRegistry) {
		const cfgProvider = container.get(IAureliaConfiguration);
		const cnf = await cfgProvider.get('au2-api');
		if (cnf) {
			for (const key of Object.keys(cnf)) {
				plugin.registerEndpoint(key, cnf[key].url);
			}
		}
	}
}