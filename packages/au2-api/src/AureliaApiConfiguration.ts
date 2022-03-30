import { IContainer, IRegistry, noop } from '@aurelia/kernel';
import { AppTask } from '@aurelia/runtime-html';
import { ApiEndpoints, IApiEndpoints } from 'ApiEndpoints';


export const AureliaApiConfiguration = createConfiguration(noop, [ApiEndpoints]);

function createConfiguration(cb: ApiRegistryConfigurator, registrations: IRegistry[]) {
	return {
		configureCallback: cb,
		register: (ctn: IContainer) => {
			return ctn.register(
				...registrations,
				AppTask.beforeCreate(() => cb(ctn.get(IApiEndpoints)) as void)
			);
		},
		configure(cb: ApiRegistryConfigurator, regs?: IRegistry[]) {
			return createConfiguration(cb, regs ?? registrations);
		},
	};
}

export type ApiRegistryConfigurator = (settings: IApiEndpoints) => void | Promise<unknown>;
