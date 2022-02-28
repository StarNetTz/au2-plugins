import { IContainer, IRegistry, noop } from '@aurelia/kernel';
import { AppTask } from '@aurelia/runtime-html';
import { AppConfiguration } from './AppConfiguration';
import { IAppConfigurationSettings, DefaultSettings } from './AppConfigurationSettings';

export type SettingsConfigurator = (settings: IAppConfigurationSettings) => void | Promise<unknown>;

export interface IAppConfigurationPlugin extends IRegistry {
	register(container: IContainer): IContainer;
	configureCallback: SettingsConfigurator;
	configure(cb: SettingsConfigurator, registrations?: IRegistry[]): IAppConfigurationPlugin;
}

export const AppConfigurationPlugin = createAppConfigurationPlugin(noop, [
	DefaultSettings,
	AppConfiguration
]);

	function createAppConfigurationPlugin(modifyDefaultSettings: SettingsConfigurator, registrations: IRegistry[]): IAppConfigurationPlugin {
		return {
			configureCallback: modifyDefaultSettings,
			register: (ctn: IContainer) => {
				return ctn.register(
					...registrations,
					AppTask.beforeCreate(() => modifyDefaultSettings(ctn.get(IAppConfigurationSettings)) as void)
				);
			},
			configure(cb: SettingsConfigurator, regs?: IRegistry[]) {
				return createAppConfigurationPlugin(cb, regs ?? registrations);
			},
		};
}