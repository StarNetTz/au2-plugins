import { HttpClient } from '@aurelia/fetch-client';
import { Rest } from './Rest';
import { Registration, DI } from '@aurelia/kernel';
import { AppTask } from '@aurelia/runtime-html';
import { IAureliaConfiguration } from '@starnetbih/au2-configuration';
import { Authentication, IAuthConfigOptions } from '@starnetbih/au2-auth';
export const IApiRegistry = DI.createInterface('IApiRegistry');
export class ApiRegistry {
    endpoints = {};
    defaultEndpoint;
    defaultBaseUrl;
    registerEndpoint(name, configureMethod, defaults, restOptions) {
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
            newClient.configure((newClientConfig) => {
                return configureMethod(newClientConfig.withDefaults(this.endpoints[name].defaults));
            });
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
    getEndpoint(name) {
        if (!name) {
            return this.defaultEndpoint || null;
        }
        return this.endpoints[name] || null;
    }
    endpointExists(name) {
        return !!this.endpoints[name];
    }
    setDefaultEndpoint(name) {
        this.defaultEndpoint = this.getEndpoint(name);
        return this;
    }
    setDefaultBaseUrl(baseUrl) {
        this.defaultBaseUrl = baseUrl;
        return this;
    }
    configure(config) {
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
    static register(container) {
        container.register(Registration.singleton(IApiRegistry, this));
        container.register(AppTask.beforeActivate(IApiRegistry, async (plugin) => {
            await ApiRegistry.RegisterFromConfigFileAndAddAuthIntercetor(container, plugin);
        }));
    }
    static async RegisterFromConfigFileAndAddAuthIntercetor(container, plugin) {
        const cfgProvider = container.get(IAureliaConfiguration);
        const cnf = await cfgProvider.get('au2-api');
        const aut = container.get(Authentication);
        const autoptions = container.get(IAuthConfigOptions);
        if (cnf) {
            for (const key of Object.keys(cnf)) {
                if (key == "authApi") {
                    if (autoptions)
                        autoptions.baseUrl = cnf[key].url;
                }
                else {
                    plugin.registerEndpoint(key, cnf[key].url);
                    if (cnf[key].auth) {
                        const rst = plugin.endpoints[key];
                        rst.addInterceptor(aut.tokenInterceptor);
                    }
                }
            }
        }
    }
}
//# sourceMappingURL=ApiRegistry.js.map