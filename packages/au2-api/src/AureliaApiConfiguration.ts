import { IContainer, IRegistry, noop } from '@aurelia/kernel';
import { AppTask } from '@aurelia/runtime-html';
import { ApiEndpoints, IApiEndpoints } from 'ApiEndpoints';
import { ApiRegistry, IApiRegistry } from "./ApiRegistry";


export const AureliaApiConfiguration = createConfiguration(noop, [ApiRegistry, ApiEndpoints]);

function createConfiguration(cb: ApiRegistryConfigurator, registrations: IRegistry[]) {
	return {
		configureCallback: cb,
		register: (ctn: IContainer) => {
			return ctn.register(
				...registrations,
				AppTask.beforeCreate(() => cb(ctn.get(IApiRegistry)) as void),
				AppTask.beforeCreate(() => cb(ctn.get(IApiEndpoints)) as void)
			);
		},
		configure(cb: ApiRegistryConfigurator, regs?: IRegistry[]) {
			return createConfiguration(cb, regs ?? registrations);
		},
	};
}

export type ApiRegistryConfigurator = (settings: IApiRegistry | IApiEndpoints) => void | Promise<unknown>;
