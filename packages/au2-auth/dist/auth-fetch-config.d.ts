import { IHttpClient } from "@aurelia/fetch-client";
import { Authentication } from "./authentication";
export declare class FetchConfig {
    readonly httpClient: IHttpClient;
    readonly auth: Authentication;
    constructor(httpClient: IHttpClient, auth: Authentication);
    configure(): void;
}
