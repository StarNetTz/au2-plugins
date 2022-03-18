import { IAuthConfigOptions } from "./configuration";
export declare class Popup {
    readonly config: IAuthConfigOptions;
    protected popupWindow: any;
    protected polling: any;
    protected url: any;
    constructor(config: IAuthConfigOptions);
    open(url: any, windowName: any, options: any, redirectUri: any): this;
    eventListener(redirectUri: any): Promise<unknown>;
    pollPopup(): Promise<unknown>;
    prepareOptions(options: any): any;
    stringifyOptions(options: any): string;
}
