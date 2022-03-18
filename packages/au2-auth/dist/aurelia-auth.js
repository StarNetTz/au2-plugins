import { FetchConfig } from './auth-fetch-config';
import { IAuthConfigOptions } from './configuration';
import { defaultAuthConfigOptions } from './base-config';
import { AuthService, IAuthService } from './auth-service';
import { AuthorizeHook } from './authorize-hook';
import { AuthFilterValueConverter } from './auth-filter';
import { Registration } from '@aurelia/kernel';
export const DefaultComponents = [
    AuthFilterValueConverter
];
function createConfiguration(options) {
    return {
        register(container) {
            const mergedOptions = {
                ...defaultAuthConfigOptions,
                ...options
            };
            return container.register(Registration.instance(IAuthConfigOptions, mergedOptions), ...DefaultComponents);
        },
        configure(options) {
            return createConfiguration(options);
        }
    };
}
export const AureliaAuthConfiguration = createConfiguration({});
export { AuthService, AuthorizeHook, IAuthConfigOptions, FetchConfig, IAuthService };
//# sourceMappingURL=aurelia-auth.js.map