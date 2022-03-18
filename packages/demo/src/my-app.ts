import { IAureliaConfiguration } from '@starnetbih/au2-configuration';
import { IApiRegistry } from '@starnetbih/au2-api';
import { IAuthService } from '@starnetbih/au2-auth';
import { IEventAggregator } from 'aurelia';

export class MyApp {
  constructor(
    @IAureliaConfiguration private Configuration: IAureliaConfiguration,
    @IApiRegistry private Reg: IApiRegistry,
    @IAuthService private Auth: IAuthService,
    @IEventAggregator readonly EventAggregator: IEventAggregator
  ) {
    this.EventAggregator.subscribe("auth:login", (msg, chn) => {
      console.log(`${(msg as any).displayName} just logged in!`);
      console.log(`Payload:`);
      console.log(this.Auth.getTokenPayload());
    })
  }

  async attached() {
    await this.login();
    await this.callLookupsApi();
  }

  public message = 'Hello World!';


  private async callLookupsApi() {
    const rest = this.Reg.getEndpoint('lookupsApi');

    const resp1 = await rest.find('/ba/entities?pageSize=10');
    console.log('find with string');
    console.log(resp1);

    console.log('find with IRestRequest');
    const resp2 = await rest.find({ resource: '/ba/entities?pageSize=10' });
    console.log(resp2);

    console.log('find with IRestRequest and criteria');
    const resp3 = await rest.find({ resource: '/ba/entities', idOrCriteria: { pageSize: 10 } });
    console.log(resp3);

    const req = {
      currentPage: 0,
      pageSize: 10,
      qry: {
        "name": "filterByName",
        "startsWith ": "b",
        "lng": "bs_cyrl_ba",
        "collection": "settlements"
      }
    };

    console.log('post with IRestRequest');
    const resp4 = await rest.post({ resource: '/typeaheads', body: req });
    console.log(resp4);
  }

  private async login() {
    await this.Auth.login({
      credentials: { username: "admin", password: "admin" }
    });
  }

}