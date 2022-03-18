import { IContainer } from '@aurelia/kernel';
import { IAureliaConfigurationOptions } from './AureliaConfigurationOptions';
export declare const AureliaConfigurationConfiguration: {
    register(container: IContainer): IContainer;
    configure(options?: Partial<IAureliaConfigurationOptions>): any;
};
