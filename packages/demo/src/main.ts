import { Aurelia } from 'aurelia';
import { MyApp } from './my-app';
import { AppConfigurationPlugin } from '@starnetbih/au2-configuration';
import { ApiPlugin } from '@starnetbih/au2-api';
import { AureliaAuthPlugin } from '@starnetbih/au2-auth';


Aurelia
  .register(
    AppConfigurationPlugin,
    AureliaAuthPlugin.configure(cfg => {
      cfg.responseTokenProp = 'bearerToken';
    }),
    ApiPlugin.configure( c=>
      {
        c.registerEndpoint('a','http://konj.dom');
      })
  ).app(MyApp)
  .start();
