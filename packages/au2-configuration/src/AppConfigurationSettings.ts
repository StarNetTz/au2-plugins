
import { IContainer, IRegistry, DI, Registration } from '@aurelia/kernel';

export interface IAppConfigurationSettings {
	Dir: string;
	File: string;

}
export const IAppConfigurationSettings = DI.createInterface<IAppConfigurationSettings>('IAppConfigurationSettings');

export class DefaultAppConfigurationSettings implements IAppConfigurationSettings {
	public Dir: string = "config";
	public File: string = "config.json";

	public static register(container: IContainer) {
		Registration.singleton(IAppConfigurationSettings, this).register(container);
	}
}

export interface AppConfigurationRegistry extends IRegistry {
	settingsProvider: AppConfigurationSettingsProvider;
	register(container: IContainer): IContainer;
	customize(cb: AppConfigurationSettingsProvider, registrations?: IRegistry[]): AppConfigurationRegistry;
}

export type AppConfigurationSettingsProvider = (settings: IAppConfigurationSettings) => void | Promise<unknown>;