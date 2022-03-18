import { Storage } from "./storage";
import { Popup } from "./popup";
import { IAuthConfigOptions } from "./configuration";
import { IHttpClient } from "@aurelia/fetch-client";
export declare class OAuth1 {
    readonly storage: Storage;
    readonly popup: Popup;
    readonly http: IHttpClient;
    readonly config: IAuthConfigOptions;
    protected defaults: any;
    protected popupInstance: any;
    constructor(storage: Storage, popup: Popup, http: IHttpClient, config: IAuthConfigOptions);
    open(options: any, userData: any): Promise<any>;
    exchangeForToken(oauthData: any, userData: any, current: any): Promise<any>;
    buildQueryString(obj: any): string;
}
