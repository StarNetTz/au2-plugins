import { Aurelia } from 'aurelia';
import { MyApp } from './my-app';
import { AureliaConfigurationConfiguration } from '@starnetbih/au2-configuration';
import { AureliaApiConfiguration } from '@starnetbih/au2-api';
import { IAuthService } from '@starnetbih/au2-servicestack-auth';


Aurelia
  .register(
    AureliaConfigurationConfiguration,
    IAuthService,
    AureliaApiConfiguration.configure(cfg => {
      cfg.register('manuallyConfiguredEndpoint', 'https://api.daas.selfip.net');
    })
  ).app(MyApp)
  .start();
