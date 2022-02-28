import { Aurelia, Registration, AppTask, IContainer} from 'aurelia';
import { MyApp } from './my-app';
import { AppConfigurationPlugin, IAppConfiguration } from '@starnetbih/au2-configuration';
import { ApiPlugin, IApiRegistry, Rest, RestOptions } from '@starnetbih/au2-api';
import { AureliaAuthConfiguration, IAuthConfigOptions, Authentication } from '@starnetbih/au2-auth';

Aurelia
  .register(
    AppConfigurationPlugin,
    AureliaAuthConfiguration.configure(<IAuthConfigOptions>{responseTokenProp: 'bearerToken' }),
    ApiPlugin
  ).app(MyApp)
  .start();
