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
import { Storage } from './storage';
import { joinUrl, isObject, isString } from './auth-utilities';
import { IAuthConfigOptions } from './configuration';
let Authentication = class Authentication {
    storage;
    config;
    tokenName;
    idTokenName;
    initialUrl;
    constructor(storage, config) {
        this.storage = storage;
        this.config = config;
        this.storage = storage;
        this.tokenName = this.config.tokenPrefix ?
            this.config.tokenPrefix + '_' + this.config.tokenName : this.config.tokenName;
        this.idTokenName = this.config.tokenPrefix ?
            this.config.tokenPrefix + '_' + this.config.idTokenName : this.config.idTokenName;
    }
    getLoginRoute() {
        return this.config.loginRoute;
    }
    getLoginRedirect() {
        return this.initialUrl || this.config.loginRedirect;
    }
    getLoginUrl() {
        return this.config.baseUrl ?
            joinUrl(this.config.baseUrl, this.config.loginUrl) : this.config.loginUrl;
    }
    getSignupUrl() {
        return this.config.baseUrl ?
            joinUrl(this.config.baseUrl, this.config.signupUrl) : this.config.signupUrl;
    }
    getProfileUrl() {
        return this.config.baseUrl ?
            joinUrl(this.config.baseUrl, this.config.profileUrl) : this.config.profileUrl;
    }
    getToken() {
        return this.storage.get(this.tokenName);
    }
    getPayload() {
        let token = this.storage.get(this.tokenName);
        return this.decomposeToken(token);
    }
    decomposeToken(token) {
        if (token && token.split('.').length === 3) {
            let base64Url = token.split('.')[1];
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            try {
                return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
            }
            catch (error) {
                return null;
            }
        }
    }
    setInitialUrl(url) {
        this.initialUrl = url;
    }
    setToken(response, redirect) {
        // access token handling
        let accessToken = response && response[this.config.responseTokenProp];
        let tokenToStore;
        if (accessToken) {
            if (isObject(accessToken) && isObject(accessToken.data)) {
                response = accessToken;
            }
            else if (isString(accessToken)) {
                tokenToStore = accessToken;
            }
        }
        if (!tokenToStore && response) {
            tokenToStore = this.config.tokenRoot && response[this.config.tokenRoot] ?
                response[this.config.tokenRoot][this.config.tokenName] : response[this.config.tokenName];
        }
        if (tokenToStore) {
            this.storage.set(this.tokenName, tokenToStore);
        }
        // id token handling
        let idToken = response && response[this.config.responseIdTokenProp];
        if (idToken) {
            this.storage.set(this.idTokenName, idToken);
        }
        if (this.config.loginRedirect && !redirect) {
            window.location.href = this.getLoginRedirect();
        }
        else if (redirect && isString(redirect)) {
            window.location.href = window.encodeURI(redirect);
        }
    }
    removeToken() {
        this.storage.remove(this.tokenName);
    }
    isAuthenticated() {
        let token = this.storage.get(this.tokenName);
        // There's no token, so user is not authenticated.
        if (!token) {
            return false;
        }
        // There is a token, but in a different format. Return true.
        if (token.split('.').length !== 3) {
            return true;
        }
        let exp;
        try {
            let base64Url = token.split('.')[1];
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            exp = JSON.parse(window.atob(base64)).exp;
        }
        catch (error) {
            return false;
        }
        if (exp) {
            return Math.round(new Date().getTime() / 1000) <= exp;
        }
        return true;
    }
    logout(redirect) {
        return new Promise(resolve => {
            this.storage.remove(this.tokenName);
            if (this.config.logoutRedirect && !redirect) {
                window.location.href = this.config.logoutRedirect;
            }
            else if (isString(redirect)) {
                window.location.href = redirect;
            }
            resolve();
        });
    }
    get tokenInterceptor() {
        let config = this.config;
        let storage = this.storage;
        let auth = this;
        return {
            request(request) {
                if (auth.isAuthenticated() && config.httpInterceptor) {
                    let tokenName = config.tokenPrefix ? `${config.tokenPrefix}_${config.tokenName}` : config.tokenName;
                    let token = storage.get(tokenName);
                    if (config.authHeader && config.authToken) {
                        token = `${config.authToken} ${token}`;
                    }
                    request.headers.set(config.authHeader, token);
                }
                return request;
            }
        };
    }
};
Authentication = __decorate([
    __param(1, IAuthConfigOptions),
    __metadata("design:paramtypes", [Storage, Object])
], Authentication);
export { Authentication };
//# sourceMappingURL=authentication.js.map