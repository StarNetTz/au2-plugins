import { FetchConfig } from './auth-fetch-config';
import { IAuthConfigOptions, DefaultAuthConfigOptions } from './configuration';
import { AuthService, IAuthService } from './auth-service';
import { AuthorizeHook } from './authorize-hook';
import { AuthFilterValueConverter } from './auth-filter';
import { IContainer, IRegistry, Registration, noop  } from '@aurelia/kernel';
import { AppTask } from '@aurelia/runtime-html';

export type SettingsConfigurator = (settings: IAuthConfigOptions) => void | Promise<unknown>;

export const DefaultComponents: IRegistry[] = [
    AuthFilterValueConverter as unknown as IRegistry
];
export interface IAureliaAuthPlugin extends IRegistry {
	register(container: IContainer): IContainer;
	configureCallback: SettingsConfigurator;
	configure(cb: SettingsConfigurator, registrations?: IRegistry[]): IAureliaAuthPlugin;
}

export const AureliaAuthPlugin = createAureliaAuthPlugin(noop, [
        DefaultAuthConfigOptions,
        ...DefaultComponents
    ]);
    
        function createAureliaAuthPlugin(modifyDefaultSettings: SettingsConfigurator, registrations: IRegistry[]): IAureliaAuthPlugin {
            return {
                configureCallback: modifyDefaultSettings,
                register: (ctn: IContainer) => {
                    return ctn.register(
                        ...registrations,
                        AppTask.beforeCreate(() => modifyDefaultSettings(ctn.get(IAuthConfigOptions)) as void)
                    );
                },
                configure(cb: SettingsConfigurator, regs?: IRegistry[]) {
                    return createAureliaAuthPlugin(cb, regs ?? registrations);
                }
            };
        }
