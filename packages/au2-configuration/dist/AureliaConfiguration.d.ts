import { IWindow } from '@aurelia/runtime-html';
import { IHttpClient } from '@aurelia/fetch-client';
import { IAureliaConfigurationOptions } from './AureliaConfigurationOptions';
export interface IAureliaConfiguration {
    get(key: string): object;
    init(): Promise<void> | Promise<object>;
}
export declare const IAureliaConfiguration: import("@aurelia/kernel").InterfaceSymbol<IAureliaConfiguration>;
export declare class AureliaConfiguration implements IAureliaConfiguration {
    private http;
    private settings;
    private win;
    private Config;
    constructor(http: IHttpClient, settings: IAureliaConfigurationOptions, win: IWindow);
    get(key: string): Promise<object>;
    init(): Promise<void>;
    getDictValue(baseObject: object, key: string): object;
}
