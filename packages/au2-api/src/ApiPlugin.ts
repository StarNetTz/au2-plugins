import { IContainer, IRegistry, noop } from '@aurelia/kernel';
import { AppTask } from '@aurelia/runtime-html';
import { ApiRegistry, IApiRegistry } from "./ApiRegistry";

export interface IApiPlugin extends IRegistry {
	register(container: IContainer): IContainer;
	configureCallback: ApiRegistryConfigurator;

	configure(cb: ApiRegistryConfigurator, registrations?: IRegistry[]): IApiPlugin;
}

export const ApiPlugin = createAppConfigurationPlugin(noop, [
	ApiRegistry
]);

function createAppConfigurationPlugin(configureCallback: ApiRegistryConfigurator, registrations: IRegistry[]): IApiPlugin {
	return {
		configureCallback: configureCallback,
		register: (ctn: IContainer) => {
			return ctn.register(
				...registrations,
				AppTask.beforeCreate(() => configureCallback(ctn.get(IApiRegistry)) as void)
			);
		},
		configure(cb: ApiRegistryConfigurator, regs?: IRegistry[]) {
			return createAppConfigurationPlugin(cb, regs ?? registrations);
		},
	};
}

export type ApiRegistryConfigurator = (settings: ApiRegistry) => void | Promise<unknown>;