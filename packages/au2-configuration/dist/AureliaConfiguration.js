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
import { DI } from '@aurelia/kernel';
import { IWindow } from '@aurelia/runtime-html';
import { IHttpClient } from '@aurelia/fetch-client';
import { IAureliaConfigurationOptions } from './AureliaConfigurationOptions';
import { UrlFactory } from 'UrlFactory';
export const IAureliaConfiguration = DI.createInterface('IAureliaConfiguration');
let AureliaConfiguration = class AureliaConfiguration {
    http;
    settings;
    win;
    Config;
    constructor(http, settings, win) {
        this.http = http;
        this.settings = settings;
        this.win = win;
    }
    async get(key) {
        return this.getDictValue(this.Config, key);
    }
    async init() {
        const resp = await this.http.fetch(UrlFactory.create(this.win, this.settings));
        this.Config = await resp.json();
    }
    getDictValue(baseObject, key) {
        const splitKey = key.split('.');
        let currentObject = baseObject;
        splitKey.forEach(key => {
            if (currentObject[key]) {
                currentObject = currentObject[key];
            }
            else {
                throw new Error('Key ' + key + ' not found');
            }
        });
        return currentObject;
    }
};
AureliaConfiguration = __decorate([
    __param(0, IHttpClient),
    __param(1, IAureliaConfigurationOptions),
    __param(2, IWindow),
    __metadata("design:paramtypes", [Object, Object, Object])
], AureliaConfiguration);
export { AureliaConfiguration };
//# sourceMappingURL=AureliaConfiguration.js.map