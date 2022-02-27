import { Aurelia, Registration, AppTask, IContainer } from 'aurelia';
import { MyApp } from './my-app';
import { AppConfigurationPlugin } from '@starnetbih/au2-configuration';
import { ApiPlugin, IApiRegistry, Rest, RestOptions } from '@starnetbih/au2-api';
import { AureliaAuthConfiguration, IAuthConfigOptions, Authentication } from '@starnetbih/au2-auth';


const xx = { baseUrl: 'http://localhost:5005', responseTokenProp: 'bearerToken' };
console.log(xx);
Aurelia
  .register(
    AppConfigurationPlugin.customize(
      settings => {
        settings.Dir = "config"
        settings.File = "config.json"
      }),
    ApiPlugin.customize(
      (reg) => {
        reg.registerEndpoint('lookupsApi', 'https://api.daas.selfip.net');
        reg.registerEndpoint('googleApi', 'https://www.cbbh.ba');
      }),
    AureliaAuthConfiguration.configure(<IAuthConfigOptions>xx),
    AppTask.beforeActivate(IContainer, async container => {

      let aut = container.get(Authentication);
      let api = container.get(IApiRegistry);

      var eps = api.endpoints;

      for (let key of Object.keys(eps)) {
        let rst = eps[key] as Rest;
        rst.addInterceptor(aut.tokenInterceptor);

      }

      console.log('Before activate app1');
    })
  ).app(MyApp)
  .start();
