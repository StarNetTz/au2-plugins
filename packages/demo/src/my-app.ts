import { IAppConfiguration } from '@starnetbih/au2-configuration';
import { IApiRegistry } from '@starnetbih/au2-api';
import { IAuthService } from '@starnetbih/au2-auth';

export class MyApp {
  constructor(
    @IAppConfiguration private Configuration: IAppConfiguration,
    @IApiRegistry private Reg: IApiRegistry,
    @IAuthService private Auth: IAuthService
  ) { }

  async attached() {
    await this.login();
    await this.callLookupsApi();
  }

  public message = 'Hello World!';

  private async callLookupsApi() {
    let rest = this.Reg.getEndpoint('lookupsApi');
    let resp = await rest.find({ resource: '/ba/entities?pageSize=10' });
    console.log(resp);
    let resp1 = await rest.find({ resource: '/ba/entities', idOrCriteria: { pageSize: 10 } });
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
    let resp3 = await rest.post({ resource: '/typeaheads', body: req });
    console.log(resp3);
  }

  private async login() {
    let u = await this.Auth.login({
      credentials: { username: "admin", password: "admin" }
    });
    console.log(u);
    console.log(this.Auth.getTokenPayload());
  }
}