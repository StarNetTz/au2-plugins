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
import { HttpClient, json } from "@aurelia/fetch-client";
import { Authentication } from "./authentication";
import { OAuth1 } from "./oAuth1";
import { OAuth2 } from "./oAuth2";
import { status, joinUrl } from "./auth-utilities";
import { DI, IEventAggregator } from "@aurelia/kernel";
import { IAuthConfigOptions } from "./configuration";
export const IAuthService = DI.createInterface("IAuthService", x => x.singleton(AuthService));
let AuthService = class AuthService {
    http;
    auth;
    oAuth1;
    oAuth2;
    config;
    eventAggregator;
    tokenInterceptor;
    constructor(http, auth, oAuth1, oAuth2, config, eventAggregator) {
        this.http = http;
        this.auth = auth;
        this.oAuth1 = oAuth1;
        this.oAuth2 = oAuth2;
        this.config = config;
        this.eventAggregator = eventAggregator;
        this.tokenInterceptor = auth.tokenInterceptor;
    }
    getMe() {
        let profileUrl = this.auth.getProfileUrl();
        return this.http.fetch(profileUrl).then(status);
    }
    isAuthenticated() {
        return this.auth.isAuthenticated();
    }
    getTokenPayload() {
        return this.auth.getPayload();
    }
    setToken(token) {
        this.auth.setToken(Object.defineProperty({}, this.config.tokenName, { value: token }));
    }
    signup(displayName, email, password) {
        let signupUrl = this.auth.getSignupUrl();
        let content;
        if (typeof arguments[0] === "object") {
            content = arguments[0];
        }
        else {
            content = {
                displayName: displayName,
                email: email,
                password: password,
            };
        }
        return this.http
            .fetch(signupUrl, {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: json(content),
        })
            .then(status)
            .then((response) => {
            if (this.config.loginOnSignup) {
                this.auth.setToken(response);
            }
            else if (this.config.signupRedirect) {
                window.location.href = this.config.signupRedirect;
            }
            this.eventAggregator.publish("auth:signup", response);
            return response;
        });
    }
    login(req) {
        let loginUrl = this.auth.getLoginUrl();
        let content;
        if (req.credentials != undefined) {
            content = req.credentials;
        }
        else {
            content = {
                email: req.email,
                password: req.password,
            };
        }
        return this.http
            .fetch(loginUrl, {
            method: "post",
            headers: typeof content === "string"
                ? { "Content-Type": "application/x-www-form-urlencoded" }
                : {},
            body: typeof content === "string" ? content : json(content),
        })
            .then(status)
            .then((response) => {
            this.auth.setToken(response);
            this.eventAggregator.publish("auth:login", response);
            return response;
        });
    }
    logout(redirectUri) {
        return this.auth.logout(redirectUri).then(() => {
            this.eventAggregator.publish("auth:logout");
        });
    }
    authenticate(name, redirect, userData) {
        let provider = this.oAuth2;
        if (this.config.providers[name].type === "1.0") {
            provider = this.oAuth1;
        }
        return provider
            .open(this.config.providers[name], userData || {})
            .then((response) => {
            this.auth.setToken(response, redirect);
            this.eventAggregator.publish("auth:authenticate", response);
            return response;
        });
    }
    unlink(provider) {
        let unlinkUrl = this.config.baseUrl
            ? joinUrl(this.config.baseUrl, this.config.unlinkUrl)
            : this.config.unlinkUrl;
        if (this.config.unlinkMethod === "get") {
            return this.http
                .fetch(unlinkUrl + provider)
                .then(status)
                .then((response) => {
                this.eventAggregator.publish("auth:unlink", response);
                return response;
            });
        }
        else if (this.config.unlinkMethod === "post") {
            return this.http
                .fetch(unlinkUrl, {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: json(provider),
            })
                .then(status)
                .then((response) => {
                this.eventAggregator.publish("auth:unlink", response);
                return response;
            });
        }
    }
};
AuthService = __decorate([
    __param(4, IAuthConfigOptions),
    __param(5, IEventAggregator),
    __metadata("design:paramtypes", [HttpClient,
        Authentication,
        OAuth1,
        OAuth2, Object, Object])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth-service.js.map