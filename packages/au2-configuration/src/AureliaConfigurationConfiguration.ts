import { IContainer, Registration } from '@aurelia/kernel';
import { AppTask } from 'aurelia';
import { AureliaConfiguration, IAureliaConfiguration } from 'AureliaConfiguration';
import { IAureliaConfigurationOptions, DefaultAureliaConfigurationOptions } from './AureliaConfigurationOptions';

export const AureliaConfigurationConfiguration = createAureliaConfiguration({});

	function createAureliaConfiguration(options?: Partial<IAureliaConfigurationOptions>) {
		return {
			register(container: IContainer): IContainer {
				const mergedOptions: Partial<IAureliaConfigurationOptions> = {
					...DefaultAureliaConfigurationOptions,
					...options
				};

				return container.register(
					Registration.instance(IAureliaConfigurationOptions, mergedOptions),
					Registration.singleton(IAureliaConfiguration, AureliaConfiguration),
					AppTask.creating(IAureliaConfiguration, async plugin => {
						await plugin.init();
					})
				);
			},
			configure(options?: Partial<IAureliaConfigurationOptions>) {
				return createAureliaConfiguration(options);
			}
		};
	}