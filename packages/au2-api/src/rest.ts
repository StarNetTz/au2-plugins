import { IHttpClient } from '@aurelia/fetch-client';
import { buildQueryString, join } from './aurlia-path-utils';
import extend from 'extend';
export class Rest {

	defaults: {} = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	};


	constructor(@IHttpClient private client: IHttpClient, private endpoint: string, private useTraditionalUriTemplates?: boolean) {}

	public find(resource: string, idOrCriteria?: string | number | {}, options?: {}, responseOutput?: { response: Response }): Promise<any | Error> {
		return this.request('GET', getRequestPath(resource, this.useTraditionalUriTemplates, idOrCriteria), undefined, options, responseOutput);
	}

	public post(resource: string, body?: {}, options?: {}, responseOutput?: { response: Response }): Promise<any | Error> {
		return this.request('POST', resource, body, options, responseOutput);
	}

	async request(method: string, path: string, body?: {}, options?: {}, responseOutput?: { response: Response }): Promise<any | Error> {
		let requestOptions = extend(true, { headers: {} }, this.defaults || {}, options || {}, { method, body });
		let contentType = requestOptions.headers['Content-Type'] || requestOptions.headers['content-type'];

		
		if (this.IsObject(body, contentType)) {
			requestOptions.body = (/^application\/(.+\+)?json/).test(contentType.toLowerCase())
				? JSON.stringify(body)
				: buildQueryString(body);
		}
		var response = await this.client.fetch(join(this.endpoint, path), requestOptions);
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

function getRequestPath(resource: string, traditional: boolean, idOrCriteria?: string | number | {}, criteria?: {}) {
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