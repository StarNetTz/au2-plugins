import { FetchConfig } from './auth-fetch-config';
import { IAuthConfigOptions } from './configuration';
import { AuthService, IAuthService } from './auth-service';
import { AuthorizeHook } from './authorize-hook';
import { IContainer, IRegistry } from '@aurelia/kernel';
export declare const DefaultComponents: IRegistry[];
export declare const AureliaAuthConfiguration: {
    register(container: IContainer): IContainer;
    configure(options?: Partial<IAuthConfigOptions>): any;
};
export { AuthService, AuthorizeHook, IAuthConfigOptions, FetchConfig, IAuthService };
