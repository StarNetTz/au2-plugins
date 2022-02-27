import { IContainer, IRegistry, noop, DI, Registration } from '@aurelia/kernel';
import { AppTask } from '@aurelia/runtime-html';
import { ApiRegistry, IApiRegistry } from "./ApiRegistry";

export interface PluginRegistry extends IRegistry {
	settingsProvider: ApiRegistryCustomizer;
	register(container: IContainer): IContainer;
	customize(cb: ApiRegistryCustomizer, registrations?: IRegistry[]): PluginRegistry;
}

export const ApiPlugin = createAppConfigurationPlugin(noop, [
	ApiRegistry
]);

function createAppConfigurationPlugin(settingsProvider: ApiRegistryCustomizer, registrations: IRegistry[]): PluginRegistry {
	return {
		settingsProvider: settingsProvider,
		register: (ctn: IContainer) => {
			return ctn.register(
				...registrations,
				AppTask.beforeCreate(() => settingsProvider(ctn.get(IApiRegistry)) as void)
			);
		},
		customize(cb: ApiRegistryCustomizer, regs?: IRegistry[]) {
			return createAppConfigurationPlugin(cb, regs ?? registrations);
		},
	};
}

export type ApiRegistryCustomizer = (settings: ApiRegistry) => void | Promise<unknown>;