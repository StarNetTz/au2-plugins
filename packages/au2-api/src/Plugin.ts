import { IContainer, IRegistry, noop, DI, Registration } from '@aurelia/kernel';
import { AppTask } from '@aurelia/runtime-html';
import { ApiRegistry, IApiRegistry } from "./ApiRegistry";

export interface PluginRegistry extends IRegistry {
	configurator: ApiRegistryConfigurator;
	register(container: IContainer): IContainer;
	configure(cb: ApiRegistryConfigurator, registrations?: IRegistry[]): PluginRegistry;
}

export const ApiPlugin = createAppConfigurationPlugin(noop, [
	ApiRegistry
]);

function createAppConfigurationPlugin(configurator: ApiRegistryConfigurator, registrations: IRegistry[]): PluginRegistry {
	return {
		configurator: configurator,
		register: (ctn: IContainer) => {
			return ctn.register(
				...registrations,
				AppTask.beforeCreate(() => configurator(ctn.get(IApiRegistry)) as void)
			);
		},
		configure(cb: ApiRegistryConfigurator, regs?: IRegistry[]) {
			return createAppConfigurationPlugin(cb, regs ?? registrations);
		},
	};
}

export type ApiRegistryConfigurator = (settings: ApiRegistry) => void | Promise<unknown>;