import { Aurelia, Registration, AppTask, IContainer} from 'aurelia';
import { MyApp } from './my-app';
import { AppConfigurationPlugin, IAppConfiguration } from '@starnetbih/au2-configuration';
import { ApiPlugin, IApiRegistry, Rest, RestOptions } from '@starnetbih/au2-api';
import { AureliaAuthConfiguration, IAuthConfigOptions, Authentication } from '@starnetbih/au2-auth';


const xx = { baseUrl: 'http://localhost:5005', responseTokenProp: 'bearerToken' };
let cnf : IAppConfiguration;
Aurelia
  .register(
    AppTask.beforeCreate(IContainer, async container => {
     console.log("before create");
    }),
    AppTask.hydrating(IContainer, async container => {
      console.log("hydrating");
     }),
     AppTask.hydrated(IContainer, async container => {
      console.log("hydrating");
     }),
    AureliaAuthConfiguration.configure(<IAuthConfigOptions>xx),
    AppConfigurationPlugin.customize(
      settings => {
        console.log("conf");
        settings.Dir = "config"
        settings.File = "config.json"
      }),
    ApiPlugin.configure(
      (reg) => {
        //reg done in api beforeActivate hoo, from config.
        //reg.registerEndpoint('lookupsApi', 'https://api.daas.selfip.net');
        //reg.registerEndpoint('googleApi', 'https://www.cbbh.ba');
      })
  ).app(MyApp)
  .start();
