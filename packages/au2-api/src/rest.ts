import { IHttpClient, Interceptor } from '@aurelia/fetch-client';
import { buildQueryString, join } from './aurlia-path-utils';

export interface IRestRequest {
	resource: string;
	idOrCriteria?: string | number | {};
	body?: {};
	options?: {};
	responseOutput?: { response: Response }
}

export interface IRest {
	find(req: string | IRestRequest): Promise<unknown | Error>;

	post(req: IRestRequest): Promise<unknown | Error>;

	addInterceptor(interceptor: Interceptor);
}

export class Rest implements IRest {
	defaults: RequestInit = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	};

	constructor(@IHttpClient private client: IHttpClient, private endpoint: string, private useTraditionalUriTemplates?: boolean) { }

	addInterceptor(interceptor: Interceptor) {
		this.client.interceptors.push(interceptor);
	}

	public find(req: string | IRestRequest): Promise<unknown | Error> {
		if (typeof (req) == 'string') 
			return this.request('GET', this.getRequestPath(req, this.useTraditionalUriTemplates));
		else 
		{
			const path = this.getRequestPath(req.resource, this.useTraditionalUriTemplates, req.idOrCriteria);
			return this.request('GET', path , undefined, req.options, req.responseOutput);
		}
			
	}

		getRequestPath(resource: string, traditional: boolean, idOrCriteria?: string | number | {}, criteria?: {}) {
			const hasSlash = resource.slice(-1) === '/';
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

	public post(req: IRestRequest): Promise<unknown | Error> {
		return this.request('POST', req.resource, req.body, req.options, req.responseOutput);
	}

	async request(method: string, path: string, body?: {}, options?: {}, responseOutput?: { response: Response }): Promise<any | Error> {

		const requestOptions = this.createRequestOptions(options, method, body);
		const contentType = requestOptions.headers['Content-Type'] || requestOptions.headers['content-type'];

		if (this.IsObject(body, contentType)) {
			requestOptions.body = (/^application\/(.+\+)?json/).test(contentType.toLowerCase())
				? JSON.stringify(body)
				: buildQueryString(body);
		}

		const response = await this.client.fetch(path, requestOptions as any);
		if (response.status >= 200 && response.status < 400) {
			if (responseOutput) {
				responseOutput.response = response;
			}
			return response.json().catch(() => null);
		}
		else
			throw response;
	}

		private createRequestOptions(options: {}, method: string, body: {}) {
			const o1 = { headers: {} };
			const o2 = this.defaults || {};
			const o3 = options || {};
			const o4 = { method, body };
			return { ...o1, ...o2, ...o3, ...o4 };
		}

	private IsObject(body: {}, contentType: any) {
		return typeof body === 'object' && body !== null && contentType;
	}
}
