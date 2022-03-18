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
import { IAuthConfigOptions } from "./configuration";
import { parseQueryString, extend, forEach } from './auth-utilities';
let Popup = class Popup {
    config;
    popupWindow = null;
    polling;
    url;
    constructor(config) {
        this.config = config;
        this.popupWindow = null;
        this.polling = null;
        this.url = '';
    }
    open(url, windowName, options, redirectUri) {
        this.url = url;
        let optionsString = this.stringifyOptions(this.prepareOptions(options || {}));
        this.popupWindow = window.open(url, windowName, optionsString);
        if (this.popupWindow && this.popupWindow.focus) {
            this.popupWindow.focus();
        }
        return this;
    }
    eventListener(redirectUri) {
        let promise = new Promise((resolve, reject) => {
            this.popupWindow.addEventListener('loadstart', (event) => {
                if (event.url.indexOf(redirectUri) !== 0) {
                    return;
                }
                let parser = document.createElement('a');
                parser.href = event.url;
                if (parser.search || parser.hash) {
                    let queryParams = parser.search.substring(1).replace(/\/$/, '');
                    let hashParams = parser.hash.substring(1).replace(/\/$/, '');
                    let hash = parseQueryString(hashParams);
                    let qs = parseQueryString(queryParams);
                    // @ts-expect-error
                    extend(qs, hash);
                    // @ts-expect-error
                    if (qs.error) {
                        reject({
                            // @ts-expect-error
                            error: qs.error
                        });
                    }
                    else {
                        resolve(qs);
                    }
                    this.popupWindow.close();
                }
            });
            this.popupWindow.addEventListener('exit', () => {
                reject({
                    data: 'Provider Popup was closed'
                });
            });
            this.popupWindow.addEventListener('loaderror', () => {
                throw new Error('Authorization Failed');
            });
        });
        return promise;
    }
    pollPopup() {
        let promise = new Promise((resolve, reject) => {
            this.polling = setInterval(() => {
                try {
                    let documentOrigin = document.location.host;
                    let popupWindowOrigin = this.popupWindow.location.host;
                    if (popupWindowOrigin === documentOrigin && (this.popupWindow.location.search || this.popupWindow.location.hash)) {
                        let queryParams = this.popupWindow.location.search.substring(1).replace(/\/$/, '');
                        let hashParams = this.popupWindow.location.hash.substring(1).replace(/[\/$]/, '');
                        let hash = parseQueryString(hashParams);
                        let qs = parseQueryString(queryParams);
                        // @ts-expect-error
                        extend(qs, hash);
                        // @ts-expect-error
                        if (qs.error) {
                            reject({
                                // @ts-expect-error
                                error: qs.error
                            });
                        }
                        else {
                            resolve(qs);
                        }
                        this.popupWindow.close();
                        clearInterval(this.polling);
                    }
                }
                catch (error) {
                    // no-op
                }
                if (!this.popupWindow) {
                    clearInterval(this.polling);
                    reject({
                        data: 'Provider Popup Blocked'
                    });
                }
                else if (this.popupWindow.closed) {
                    clearInterval(this.polling);
                    reject({
                        data: 'Problem poll popup'
                    });
                }
            }, 35);
        });
        return promise;
    }
    prepareOptions(options) {
        let width = options.width || 500;
        let height = options.height || 500;
        return extend({
            width: width,
            height: height,
            left: window.screenX + ((window.outerWidth - width) / 2),
            top: window.screenY + ((window.outerHeight - height) / 2.5)
            // @ts-expect-error
        }, options);
    }
    stringifyOptions(options) {
        let parts = [];
        // @ts-expect-error
        forEach(options, function (value, key) {
            parts.push(key + '=' + value);
        });
        return parts.join(',');
    }
};
Popup = __decorate([
    __param(0, IAuthConfigOptions),
    __metadata("design:paramtypes", [Object])
], Popup);
export { Popup };
//# sourceMappingURL=popup.js.map