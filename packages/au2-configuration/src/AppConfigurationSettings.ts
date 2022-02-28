
import { IContainer, DI, Registration } from '@aurelia/kernel';

export interface IAppConfigurationSettings {
	dir: string;
	file: string;
}

export const IAppConfigurationSettings = DI.createInterface<IAppConfigurationSettings>('IAppConfigurationSettings');

export class DefaultSettings implements IAppConfigurationSettings {
	public dir: string = "config";
	public file: string = "config.json";

	public static register(container: IContainer) {
		Registration.singleton(IAppConfigurationSettings, this).register(container);
	}
}