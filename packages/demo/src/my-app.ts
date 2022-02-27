import { IAppConfiguration } from '@starnetbih/au2-configuration';
import { IApiRegistry, IRest, IRestRequest } from '@starnetbih/au2-api';

export class MyApp {
  constructor(
    @IAppConfiguration private Configuration: IAppConfiguration,
    @IApiRegistry private Reg: IApiRegistry
    ) { }

  async attached() {
    console.log(await this.Configuration.get('url'));
    console.log(await this.Configuration.get('ab.x'));
    let rest = this. Reg.getEndpoint('api');
    let resp = await rest.find({resource:'/ba/entities?pageSize=10'});
    console.log(resp);
    let resp1 = await rest.find({resource:'/ba/entities',idOrCriteria :{pageSize:10}});
    console.log(resp1);

    let req = {
		  currentPage: 0,
		  pageSize: 10,
		  qry: {
			"name": "filterByName",
			"startsWith ": "b",
			"lng": "bs_cyrl_ba",
			"collection": "settlements"
		  }
		};
    let resp3 = await rest.post({resource:'/typeaheads', body : req});
    console.log(resp3);
  }
  public message = 'Hello World!';
}
