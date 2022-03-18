var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { lifecycleHooks } from "@aurelia/runtime-html";
import { IRouter } from '@aurelia/router-lite';
import { Authentication } from "./authentication";
let AuthorizeHook = class AuthorizeHook {
    auth;
    router;
    constructor(auth, router) {
        this.auth = auth;
        this.router = router;
        this.auth = auth;
    }
    canLoad(vm, params, next, current) {
        let isLoggedIn = this.auth.isAuthenticated();
        let loginRoute = this.auth.getLoginRoute();
        if (next?.data?.auth) {
            if (!isLoggedIn) {
                this.auth.setInitialUrl(window.location.href);
                return this.router.load(loginRoute);
            }
        }
        return true;
    }
};
AuthorizeHook = __decorate([
    lifecycleHooks(),
    __param(1, IRouter),
    __metadata("design:paramtypes", [Authentication, Object])
], AuthorizeHook);
export { AuthorizeHook };
//# sourceMappingURL=authorize-hook.js.map