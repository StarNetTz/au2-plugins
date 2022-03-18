import { IHttpClient } from "@aurelia/fetch-client";
import { Storage } from "./storage";
import { Popup } from "./popup";
import { IAuthConfigOptions } from "./configuration";
import { Authentication } from "./authentication";
export declare class OAuth2 {
    readonly storage: Storage;
    readonly popup: Popup;
    readonly auth: Authentication;
    readonly http: IHttpClient;
    readonly config: IAuthConfigOptions;
    protected defaults: any;
    constructor(storage: Storage, popup: Popup, auth: Authentication, http: IHttpClient, config: IAuthConfigOptions);
    open(options: any, userData: any): any;
    verifyIdToken(oauthData: any, providerName: any): boolean;
    exchangeForToken(oauthData: any, userData: any, current: any): Promise<any>;
    buildQueryString(current: any): string;
}
