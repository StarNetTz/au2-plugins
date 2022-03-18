import { Registration } from '@aurelia/kernel';
import { AppTask } from 'aurelia';
import { AureliaConfiguration, IAureliaConfiguration } from 'AureliaConfiguration';
import { IAureliaConfigurationOptions, DefaultAureliaConfigurationOptions } from './AureliaConfigurationOptions';
export const AureliaConfigurationConfiguration = createAureliaConfiguration({});
function createAureliaConfiguration(options) {
    return {
        register(container) {
            const mergedOptions = {
                ...DefaultAureliaConfigurationOptions,
                ...options
            };
            return container.register(Registration.instance(IAureliaConfigurationOptions, mergedOptions), Registration.singleton(IAureliaConfiguration, AureliaConfiguration), AppTask.beforeCreate(IAureliaConfiguration, async (plugin) => {
                console.log('inicijalizacija bato');
                await plugin.init();
            }));
        },
        configure(options) {
            return createAureliaConfiguration(options);
        }
    };
}
//# sourceMappingURL=AureliaConfigurationConfiguration.js.map