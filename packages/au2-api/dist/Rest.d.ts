import { IHttpClient, Interceptor } from '@aurelia/fetch-client';
export interface IRestRequest {
    resource: string;
    idOrCriteria?: string | number | {};
    body?: {};
    options?: {};
    responseOutput?: {
        response: Response;
    };
}
export interface IRest {
    find(req: string | IRestRequest): Promise<any | Error>;
    post(req: IRestRequest): Promise<any | Error>;
    addInterceptor(interceptor: Interceptor): any;
}
export declare class Rest implements IRest {
    private client;
    private endpoint;
    private useTraditionalUriTemplates?;
    defaults: {};
    constructor(client: IHttpClient, endpoint: string, useTraditionalUriTemplates?: boolean);
    addInterceptor(interceptor: Interceptor): void;
    find(req: string | IRestRequest): Promise<any | Error>;
    getRequestPath(resource: string, traditional: boolean, idOrCriteria?: string | number | {}, criteria?: {}): string;
    post(req: IRestRequest): Promise<any | Error>;
    request(method: string, path: string, body?: {}, options?: {}, responseOutput?: {
        response: Response;
    }): Promise<any | Error>;
    private createRequestOptions;
    private IsObject;
}
