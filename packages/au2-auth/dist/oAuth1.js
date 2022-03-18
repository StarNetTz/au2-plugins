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
import { extend, forEach, joinUrl, status } from "./auth-utilities";
import { Storage } from "./storage";
import { Popup } from "./popup";
import { IAuthConfigOptions } from "./configuration";
import { IHttpClient, json } from "@aurelia/fetch-client";
let OAuth1 = class OAuth1 {
    storage;
    popup;
    http;
    config;
    defaults;
    popupInstance;
    constructor(storage, popup, http, config) {
        this.storage = storage;
        this.popup = popup;
        this.http = http;
        this.config = config;
        this.defaults = {
            url: null,
            name: null,
            popupOptions: null,
            redirectUri: null,
            authorizationEndpoint: null,
        };
    }
    open(options, userData) {
        // @ts-expect-error
        let current = extend({}, this.defaults, options);
        let serverUrl = this.config.baseUrl
            ? joinUrl(this.config.baseUrl, current.url)
            : current.url;
        if (this.config.platform !== "mobile") {
            this.popupInstance = this.popup.open("", current.name, current.popupOptions, current.redirectUri);
        }
        return this.http
            .fetch(serverUrl, {
            method: "post",
        })
            .then(status)
            .then((response) => {
            if (this.config.platform === "mobile") {
                this.popupInstance = this.popup.open([
                    current.authorizationEndpoint,
                    this.buildQueryString(response),
                ].join("?"), current.name, current.popupOptions, current.redirectUri);
            }
            else {
                this.popupInstance.popupWindow.location = [
                    current.authorizationEndpoint,
                    this.buildQueryString(response),
                ].join("?");
            }
            let popupListener = this.config.platform === "mobile"
                ? this.popup.eventListener(current.redirectUri)
                : this.popup.pollPopup();
            return popupListener.then((result) => this.exchangeForToken(result, userData, current));
        });
    }
    exchangeForToken(oauthData, userData, current) {
        // @ts-expect-error
        let data = extend({}, userData, oauthData);
        let exchangeForTokenUrl = this.config.baseUrl
            ? joinUrl(this.config.baseUrl, current.url)
            : current.url;
        let credentials = this.config.withCredentials ? "include" : "same-origin";
        return this.http
            .fetch(exchangeForTokenUrl, {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: json(data),
            credentials: credentials,
        })
            .then(status);
    }
    buildQueryString(obj) {
        let str = [];
        // @ts-expect-error
        forEach(obj, (value, key) => str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value)));
        return str.join("&");
    }
};
OAuth1 = __decorate([
    __param(2, IHttpClient),
    __param(3, IAuthConfigOptions),
    __metadata("design:paramtypes", [Storage,
        Popup, Object, Object])
], OAuth1);
export { OAuth1 };
//# sourceMappingURL=oAuth1.js.map