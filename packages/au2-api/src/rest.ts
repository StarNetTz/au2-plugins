import { IHttpClient, Interceptor } from '@aurelia/fetch-client';
import { buildQueryString, join } from './aurlia-path-utils';
import extend from 'extend';

export interface IRestRequest {
	resource: string;
	idOrCriteria?: string | number | {};
	body?: {};
	options?: {};
	responseOutput?: { response: Response }

}
export interface IRest {
	find(req: string | IRestRequest): Promise<any | Error>;

	post(req: IRestRequest): Promise<any | Error>;
	addInterceptor(interceptor: Interceptor);
}

export class Rest implements IRest {
	defaults: {} = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	};

	constructor(@IHttpClient private client: IHttpClient, private endpoint: string, private useTraditionalUriTemplates?: boolean) { }

	addInterceptor(interceptor: Interceptor) {
		this.client.interceptors.push(interceptor);
	}



	public find(req: string | IRestRequest): Promise<any | Error> {
		if (typeof (req) == 'string') {
			return this.request('GET', this.getRequestPath(req, this.useTraditionalUriTemplates));
		}
		else {
			return this.request('GET', this.getRequestPath(req.resource, this.useTraditionalUriTemplates, req.idOrCriteria), undefined, req.options, req.responseOutput);
		}

	}

	getRequestPath(resource: string, traditional: boolean, idOrCriteria?: string | number | {}, criteria?: {}) {
		let hasSlash = resource.slice(-1) === '/';
		if (typeof idOrCriteria === 'string' || typeof idOrCriteria === 'number') {
			resource = `${join(resource, String(idOrCriteria))}${hasSlash ? '/' : ''}`;
		} else {
			criteria = idOrCriteria;
		}

		if (typeof criteria === 'object' && criteria !== null) {
			resource += `?${buildQueryString(criteria, traditional)}`;
		} else if (criteria) {
			resource += `${hasSlash ? '' : '/'}${criteria}${hasSlash ? '/' : ''}`;
		}
		return resource;
	}

	public post(req: IRestRequest): Promise<any | Error> {
		return this.request('POST', req.resource, req.body, req.options, req.responseOutput);
	}

	async request(method: string, path: string, body?: {}, options?: {}, responseOutput?: { response: Response }): Promise<any | Error> {

		let requestOptions = extend(true, { headers: {} }, this.defaults || {}, options || {}, { method, body });
		let contentType = requestOptions.headers['Content-Type'] || requestOptions.headers['content-type'];

		if (this.IsObject(body, contentType)) {
			requestOptions.body = (/^application\/(.+\+)?json/).test(contentType.toLowerCase())
				? JSON.stringify(body)
				: buildQueryString(body);
		}

		var response = await this.client.fetch(path, requestOptions);
		if (response.status >= 200 && response.status < 400) {
			if (responseOutput) {
				responseOutput.response = response;
			}
			return response.json().catch(() => null);
		}
		else
			throw response;
	}

	private IsObject(body: {}, contentType: any) {
		return typeof body === 'object' && body !== null && contentType;
	}
}