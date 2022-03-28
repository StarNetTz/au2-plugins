
import { IAuthConfigOptions } from './configuration';
import { defaultAuthConfigOptions } from './base-config';
import { AuthService, IAuthService } from './auth-service';


import { IContainer, IRegistry, Registration } from '@aurelia/kernel';

export const DefaultComponents: IRegistry[] = [];

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

export { AuthService,  IAuthConfigOptions, IAuthService};