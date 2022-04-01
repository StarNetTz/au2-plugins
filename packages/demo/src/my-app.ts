import { IAureliaConfiguration } from '@starnetbih/au2-configuration';
import { IApiEndpoints } from '@starnetbih/au2-api';
import { IAuthService } from '@starnetbih/au2-servicestack-auth';
import { IEventAggregator } from 'aurelia';
import { JsonServiceClient } from "@servicestack/client"

export class MyApp {
  constructor(
    @IAureliaConfiguration private Configuration: IAureliaConfiguration,
    @IAuthService private Auth: IAuthService,
    @IEventAggregator readonly EventAggregator: IEventAggregator,
    @IApiEndpoints private ApiEndpoints: IApiEndpoints,
  ) {
    this.EventAggregator.subscribe("auth:login", (msg, chn) => {
      console.log(`${(msg as any).displayName} just logged in!`);
      console.log(`Payload:`);
      //console.log(this.Auth.getTokenPayload());
    })
  }

  async attached() {
    await this.login();
    //await this.testjsonplaceholderEndpoint();
    //await this.callLookupsApi();
    //await this.testManuallyConfiguredEndpoint();
    await this.testHello5001();
  }

  public message = 'Hello World!';


  private async callLookupsApi() {
    const rest = this.ApiEndpoints.get('lookupsApi');

    const resp1 = await rest.find('/ba/entities?pageSize=10');
    console.log('find with string');
    console.log(resp1);

    console.log('find with IRestRequest');
    const resp2 = await rest.find({ resource: '/ba/entities?pageSize=10', options : {credentials:"include"} });
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

  private async testManuallyConfiguredEndpoint() {
    const rest = this.ApiEndpoints.get('manuallyConfiguredEndpoint');

    const resp1 = await rest.find('/ba/entities?pageSize=3');
    console.log(resp1);
  }
  

  private async testHello5001() {
    const rest = this.ApiEndpoints.get('securedHelloApi');
    const resp1 = await rest.find({  resource:'/hello/zeko'});
    console.log(resp1);
  }
  

  private async testjsonplaceholderEndpoint() {
    const rest = this.ApiEndpoints.get('jsonplaceholderApi');

    const resp1 = await rest.find('/posts/1');
    console.log(resp1);
  }

  private async login() {
    //const prof = await this.Auth.signIn({ username: "admin", password: "admin" });

    const authEndpoint = this.ApiEndpoints.get('authApi');
		const resp = await authEndpoint.post({  resource:'/auth/credentials', body:{username:"admin", password:"admin"}, options : {credentials:"include"}}) as any;
    console.log(resp);
   // const resp2 = await authEndpoint.find({  resource:'/users', options : {credentials:"include"}}) as any;
  }

 
}