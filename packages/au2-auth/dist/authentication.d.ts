import { Storage } from './storage';
import { IAuthConfigOptions } from './configuration';
export declare class Authentication {
    private storage;
    readonly config: IAuthConfigOptions;
    private tokenName;
    private idTokenName;
    private initialUrl;
    constructor(storage: Storage, config: IAuthConfigOptions);
    getLoginRoute(): string;
    getLoginRedirect(): any;
    getLoginUrl(): any;
    getSignupUrl(): any;
    getProfileUrl(): any;
    getToken(): any;
    getPayload(): any;
    decomposeToken(token: any): any;
    setInitialUrl(url: any): void;
    setToken(response: any, redirect?: any): void;
    removeToken(): void;
    isAuthenticated(): boolean;
    logout(redirect: any): Promise<void>;
    get tokenInterceptor(): {
        request(request: any): any;
    };
}
