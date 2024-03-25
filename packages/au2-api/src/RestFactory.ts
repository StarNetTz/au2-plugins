import { HttpClient, HttpClientConfiguration} from '@aurelia/fetch-client';
import { DI } from 'aurelia';
import { IRest, Rest } from 'rest';


export interface IRestFactory
{
	create(name: string, url: string, defaults?: RequestInit) : IRest;
	createUsingCallback(name: string, configureCb: (settings: HttpClientConfiguration) => HttpClientConfiguration, defaults?: RequestInit): IRest;
}

export const IRestFactory = DI.createInterface<IRestFactory>('IRestFactory', x => x.singleton(RestFactory));

export class RestFactory implements IRestFactory {
	public create(name: string, url: string, defaults?: RequestInit) : IRest
	{
		const cli = new HttpClient().
		configure(x => x
			.withBaseUrl(url)
		);
		const rest = new Rest(cli, name);
		if (defaults)
			rest.defaults = defaults;
		return rest;
	}

	public createUsingCallback(name: string, configureCb: (settings: HttpClientConfiguration) => HttpClientConfiguration, defaults?: RequestInit): IRest {
		const cli = new HttpClient();
		const rest = new Rest(cli, name);
		
		if (defaults)
			rest.defaults = defaults;

		cli.configure( (cfg: HttpClientConfiguration) => {
			return configureCb(cfg.withDefaults(rest.defaults));
		});

		return rest;
	}
}