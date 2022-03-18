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
import { IHttpClient } from '@aurelia/fetch-client';
import { buildQueryString, join } from './aurlia-path-utils';
let Rest = class Rest {
    client;
    endpoint;
    useTraditionalUriTemplates;
    defaults = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    constructor(client, endpoint, useTraditionalUriTemplates) {
        this.client = client;
        this.endpoint = endpoint;
        this.useTraditionalUriTemplates = useTraditionalUriTemplates;
    }
    addInterceptor(interceptor) {
        this.client.interceptors.push(interceptor);
    }
    find(req) {
        if (typeof (req) == 'string')
            return this.request('GET', this.getRequestPath(req, this.useTraditionalUriTemplates));
        else
            return this.request('GET', this.getRequestPath(req.resource, this.useTraditionalUriTemplates, req.idOrCriteria), undefined, req.options, req.responseOutput);
    }
    getRequestPath(resource, traditional, idOrCriteria, criteria) {
        const hasSlash = resource.slice(-1) === '/';
        if (typeof idOrCriteria === 'string' || typeof idOrCriteria === 'number') {
            resource = `${join(resource, String(idOrCriteria))}${hasSlash ? '/' : ''}`;
        }
        else {
            criteria = idOrCriteria;
        }
        if (typeof criteria === 'object' && criteria !== null) {
            resource += `?${buildQueryString(criteria, traditional)}`;
        }
        else if (criteria) {
            resource += `${hasSlash ? '' : '/'}${criteria}${hasSlash ? '/' : ''}`;
        }
        return resource;
    }
    post(req) {
        return this.request('POST', req.resource, req.body, req.options, req.responseOutput);
    }
    async request(method, path, body, options, responseOutput) {
        const requestOptions = this.createRequestOptions(options, method, body);
        const contentType = requestOptions.headers['Content-Type'] || requestOptions.headers['content-type'];
        if (this.IsObject(body, contentType)) {
            requestOptions.body = (/^application\/(.+\+)?json/).test(contentType.toLowerCase())
                ? JSON.stringify(body)
                : buildQueryString(body);
        }
        const response = await this.client.fetch(path, requestOptions);
        if (response.status >= 200 && response.status < 400) {
            if (responseOutput) {
                responseOutput.response = response;
            }
            return response.json().catch(() => null);
        }
        else
            throw response;
    }
    createRequestOptions(options, method, body) {
        const o1 = { headers: {} };
        const o2 = this.defaults || {};
        const o3 = options || {};
        const o4 = { method, body };
        return { ...o1, ...o2, ...o3, ...o4 };
    }
    IsObject(body, contentType) {
        return typeof body === 'object' && body !== null && contentType;
    }
};
Rest = __decorate([
    __param(0, IHttpClient),
    __metadata("design:paramtypes", [Object, String, Boolean])
], Rest);
export { Rest };
//# sourceMappingURL=Rest.js.map