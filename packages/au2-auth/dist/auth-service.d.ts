import { HttpClient } from "@aurelia/fetch-client";
import { Authentication } from "./authentication";
import { OAuth1 } from "./oAuth1";
import { OAuth2 } from "./oAuth2";
import { IEventAggregator } from "@aurelia/kernel";
import { IAuthConfigOptions } from "./configuration";
export declare const IAuthService: import("@aurelia/kernel").InterfaceSymbol<IAuthService>;
export interface IAuthService extends AuthService {
}
export interface ILoginRequest {
    email: string;
    password: string;
    credentials: any;
}
export declare class AuthService {
    readonly http: HttpClient;
    readonly auth: Authentication;
    readonly oAuth1: OAuth1;
    readonly oAuth2: OAuth2;
    readonly config: IAuthConfigOptions;
    readonly eventAggregator: IEventAggregator;
    protected tokenInterceptor: any;
    constructor(http: HttpClient, auth: Authentication, oAuth1: OAuth1, oAuth2: OAuth2, config: IAuthConfigOptions, eventAggregator: IEventAggregator);
    getMe(): Promise<any>;
    isAuthenticated(): boolean;
    getTokenPayload(): any;
    setToken(token: any): void;
    signup(displayName: any, email: any, password: any): Promise<any>;
    login(req: Partial<ILoginRequest>): Promise<any>;
    logout(redirectUri: any): Promise<void>;
    authenticate(name: any, redirect: any, userData: any): any;
    unlink(provider: any): Promise<any>;
}
