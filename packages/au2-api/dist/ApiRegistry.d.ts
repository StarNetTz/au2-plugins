import { Rest } from './Rest';
import { IContainer } from '@aurelia/kernel';
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
    configure(config: {
        defaultEndpoint: string;
        defaultBaseUrl: string;
        endpoints: Array<{
            name: string;
            endpoint: string;
            config: {};
            default: boolean;
        }>;
    }): IApiRegistry;
    endpoints: {
        [key: string]: Rest;
    };
    defaultEndpoint: Rest;
    defaultBaseUrl: string;
}
export declare const IApiRegistry: import("@aurelia/kernel").InterfaceSymbol<IApiRegistry>;
export declare class ApiRegistry implements IApiRegistry {
    endpoints: {
        [key: string]: Rest;
    };
    defaultEndpoint: Rest;
    defaultBaseUrl: string;
    registerEndpoint(name: string, configureMethod?: string | Function, defaults?: {}, restOptions?: RestOptions): IApiRegistry;
    getEndpoint(name?: string): Rest;
    endpointExists(name: string): boolean;
    setDefaultEndpoint(name: string): IApiRegistry;
    setDefaultBaseUrl(baseUrl: string): IApiRegistry;
    configure(config: {
        defaultEndpoint: string;
        defaultBaseUrl: string;
        endpoints: Array<{
            name: string;
            endpoint: string;
            config: {};
            default: boolean;
        }>;
    }): IApiRegistry;
    static register(container: IContainer): void;
    private static RegisterFromConfigFileAndAddAuthIntercetor;
}
