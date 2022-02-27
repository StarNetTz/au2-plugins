import { HttpClient, HttpClientConfiguration } from '@aurelia/fetch-client';
import { Rest } from './Rest';
import { IContainer, Registration, DI } from '@aurelia/kernel';
import { AppTask } from '@aurelia/runtime-html';
import { IAppConfiguration } from '@starnetbih/au2-configuration';
import { Authentication, IAuthOptions } from '@starnetbih/au2-auth';


export interface RestOptions {
	/**
	 * `true` to use the traditional URI template standard (RFC6570) when building
	 * query strings from criteria objects, `false` otherwise. Default is `false`.
	 * NOTE: maps to `useTraditionalUriTemplates` parameter on `Rest` constructor.
	 *
	 * @type {boolean}
	 */
	useTraditionalUriTemplates?: boolean;
	shouldAuthenticate?: boolean;
}

/**
* Config class. Configures and stores endpoints
*/
export interface IApiRegistry {
	registerEndpoint(name: string, configureMethod?: string | Function, defaults?: {}, restOptions?: RestOptions): IApiRegistry;
	getEndpoint(name?: string): Rest;
	endpointExists(name: string): boolean;
	setDefaultEndpoint(name: string): IApiRegistry;
	setDefaultBaseUrl(baseUrl: string): IApiRegistry;
	configure(config: { defaultEndpoint: string, defaultBaseUrl: string, endpoints: Array<{ name: string, endpoint: string, config: {}, default: boolean }> }): IApiRegistry;
	init(): void | Promise<any>;
	endpoints: { [key: string]: Rest };
	defaultEndpoint: Rest;
	defaultBaseUrl: string;
}
export const IApiRegistry = DI.createInterface<IApiRegistry>('IApiRegistry');


export class ApiRegistry implements IApiRegistry {
	/**
	 * Collection of configures endpoints
	 *
	 * @param {{}} Key: endpoint name; value: Rest client
	 */
	endpoints: { [key: string]: Rest } = {};

	/**
	 * Current default endpoint if set
	 *
	 * @param {Rest} defaultEndpoint The Rest client
	 */
	defaultEndpoint: Rest;

	/**
	 * Current default baseUrl if set
	 *
	 * @param {string} defaultBaseUrl The Rest client
	 */
	defaultBaseUrl: string;

	/**
	 * Register a new endpoint.
	 *
	 * @param {string}          name              The name of the new endpoint.
	 * @param {Function|string} [configureMethod] Endpoint url or configure method for client.configure().
	 * @param {{}}              [defaults]        New defaults for the HttpClient
	 * @param {RestOptions}     [restOptions]     Options to pass when constructing the Rest instance.
	 *
	 * @see http://aurelia.io/docs.html#/aurelia/fetch-client/latest/doc/api/class/HttpClientConfiguration
	 * @return {ApiRegistry} this Fluent interface
	 * @chainable
	 */
	registerEndpoint(name: string, configureMethod?: string | Function, defaults?: {}, restOptions?: RestOptions): IApiRegistry {
		let newClient = new HttpClient();
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

	/**
	 * Get a previously registered endpoint. Returns null when not found.
	 *
	 * @param {string} [name] The endpoint name. Returns default endpoint when not set.
	 *
	 * @return {Rest|null}
	 */
	getEndpoint(name?: string): Rest {
		if (!name) {
			return this.defaultEndpoint || null;
		}

		return this.endpoints[name] || null;
	}

	/**
	 * Check if an endpoint has been registered.
	 *
	 * @param {string} name The endpoint name
	 *
	 * @return {boolean}
	 */
	public endpointExists(name: string): boolean {
		return !!this.endpoints[name];
	}

	/**
	 * Set a previously registered endpoint as the default.
	 *
	 * @param {string} name The endpoint name
	 *
	 * @return {ApiRegistry} this Fluent interface
	 * @chainable
	 */
	public setDefaultEndpoint(name: string): IApiRegistry {
		this.defaultEndpoint = this.getEndpoint(name);

		return this;
	}

	/**
	 * Set a base url for all endpoints
	 *
	 * @param {string} baseUrl The url for endpoints to append
	 *
	 * @return {ApiRegistry} this Fluent interface
	 * @chainable
	 */
	public setDefaultBaseUrl(baseUrl: string): IApiRegistry {
		this.defaultBaseUrl = baseUrl;

		return this;
	}

	/**
	 * Configure with an object
	 *
	 * @param {{}} config The configuration object
	 *
	 * @return {ApiRegistry} this Fluent interface
	 * @chainable
	 */
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

	init(): void | Promise<any> {
		throw new Error('Method not implemented.');
	}

	public static register(container: IContainer): void {
		container.register(Registration.singleton(IApiRegistry, this));
		container.register(
			AppTask.beforeActivate(IApiRegistry, async plugin => {
				let cfgProvider = container.get(IAppConfiguration);
				let cnf = await cfgProvider.get('au2-api');
				let aut = container.get(Authentication);
				let autoptions = container.get(IAuthOptions);
				if (cnf) {
					for (let key of Object.keys(cnf)) {
						if (key == "authApi") {
							if (autoptions)
								autoptions.baseUrl = cnf[key].url;
						}
						else {
							plugin.registerEndpoint(key, cnf[key].url);
							if (cnf[key].auth) {
								let rst = plugin.endpoints[key] as Rest;
								rst.addInterceptor(aut.tokenInterceptor);
							}
						}
					}
				}
			}));
	}
}