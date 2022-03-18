import { FetchConfig } from './auth-fetch-config';
import { IAuthConfigOptions } from './configuration';
import { defaultAuthConfigOptions } from './base-config';
import { AuthService, IAuthService } from './auth-service';
import { AuthorizeHook } from './authorize-hook';
import { AuthFilterValueConverter } from './auth-filter';
import { IContainer, IRegistry, Registration } from '@aurelia/kernel';

export const DefaultComponents: IRegistry[] = [
    AuthFilterValueConverter as unknown as IRegistry
];

function createConfiguration(options?: Partial<IAuthConfigOptions>) {
    return {
        register(container: IContainer): IContainer {
            const mergedOptions: Partial<IAuthConfigOptions> = {
                ...defaultAuthConfigOptions,
                ...options
            };

            return container.register(
                Registration.instance(IAuthConfigOptions, mergedOptions), 
                ...DefaultComponents
            );
        },
        configure(options?: Partial<IAuthConfigOptions>) {
            return createConfiguration(options);
        }
    }
}

export const AureliaAuthConfiguration = createConfiguration({});

export { AuthService, AuthorizeHook, IAuthConfigOptions, FetchConfig, IAuthService};