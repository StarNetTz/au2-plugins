import { IContainer, IRegistry, noop } from '@aurelia/kernel';
import { AppTask } from '@aurelia/runtime-html';
import { ApiRegistry, IApiRegistry } from "./ApiRegistry";


export const AureliaApiConfiguration = createConfiguration(noop, [ApiRegistry]);

function createConfiguration(cb: ApiRegistryConfigurator, registrations: IRegistry[]) {
	return {
		configureCallback: cb,
		register: (ctn: IContainer) => {
			return ctn.register(
				...registrations,
				AppTask.beforeCreate(() => cb(ctn.get(IApiRegistry)) as void)
			);
		},
		configure(cb: ApiRegistryConfigurator, regs?: IRegistry[]) {
			return createConfiguration(cb, regs ?? registrations);
		},
	};
}

export type ApiRegistryConfigurator = (settings: ApiRegistry) => void | Promise<unknown>;
