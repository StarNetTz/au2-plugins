import { noop } from '@aurelia/kernel';
import { AppTask } from '@aurelia/runtime-html';
import { ApiRegistry, IApiRegistry } from "./ApiRegistry";
export const AureliaApiConfiguration = createConfiguration(noop, [ApiRegistry]);
function createConfiguration(cb, registrations) {
    return {
        configureCallback: cb,
        register: (ctn) => {
            return ctn.register(...registrations, AppTask.beforeCreate(() => cb(ctn.get(IApiRegistry))));
        },
        configure(cb, regs) {
            return createConfiguration(cb, regs ?? registrations);
        },
    };
}
//# sourceMappingURL=AureliaApiConfiguration.js.map