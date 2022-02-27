import { Aurelia, Registration, AppTask, IContainer} from 'aurelia';
import { MyApp } from './my-app';
import { AppConfigurationPlugin, IAppConfiguration } from '@starnetbih/au2-configuration';
import { ApiPlugin, IApiRegistry, Rest, RestOptions } from '@starnetbih/au2-api';
import { AureliaAuthConfiguration, IAuthConfigOptions, Authentication } from '@starnetbih/au2-auth';

Aurelia
  .register(
    AureliaAuthConfiguration.configure(<IAuthConfigOptions>{responseTokenProp: 'bearerToken' }),
    AppConfigurationPlugin.customize(
      settings => {
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
