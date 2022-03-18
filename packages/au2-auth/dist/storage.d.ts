import { IAuthConfigOptions } from "./configuration";
export declare class Storage {
    readonly config: IAuthConfigOptions;
    private storage;
    constructor(config: IAuthConfigOptions);
    get(key: any): any;
    set(key: any, value: any): any;
    remove(key: any): any;
    _getStorage(type: any): globalThis.Storage;
}
