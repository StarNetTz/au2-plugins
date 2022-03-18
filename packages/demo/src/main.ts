import { Aurelia } from 'aurelia';
import { MyApp } from './my-app';
import { AureliaConfigurationConfiguration } from '@starnetbih/au2-configuration';
import { AureliaApiConfiguration } from '@starnetbih/au2-api';
import { AureliaAuthConfiguration } from '@starnetbih/au2-auth';


Aurelia
  .register(
    AureliaConfigurationConfiguration,
    AureliaAuthConfiguration.configure({ responseTokenProp: 'bearerToken' }),
    AureliaApiConfiguration.configure(cfg => {
      cfg.registerEndpoint('manuallyConfiguredEndpoint', 'https://api.daas.selfip.net');
    })
  ).app(MyApp)
  .start();
