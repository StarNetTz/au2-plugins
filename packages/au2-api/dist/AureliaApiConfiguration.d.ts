import { IContainer, IRegistry } from '@aurelia/kernel';
import { ApiRegistry } from "./ApiRegistry";
export declare const AureliaApiConfiguration: {
    configureCallback: ApiRegistryConfigurator;
    register: (ctn: IContainer) => IContainer;
    configure(cb: ApiRegistryConfigurator, regs?: IRegistry[]): any;
};
export declare type ApiRegistryConfigurator = (settings: ApiRegistry) => void | Promise<unknown>;
