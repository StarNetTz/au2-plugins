import { IRouter } from '@aurelia/router-lite';
import { Authentication } from "./authentication";
export declare class AuthorizeHook {
    private auth;
    private router;
    constructor(auth: Authentication, router: IRouter);
    canLoad(vm: any, params: any, next: any, current: any): true | Promise<boolean>;
}
