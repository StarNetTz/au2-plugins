import { Aurelia } from 'aurelia';
import { MyApp } from './my-app';
import { AureliaConfigurationConfiguration } from '@starnetbih/au2-configuration';
import { AureliaApiConfiguration } from '@starnetbih/au2-api';

Aurelia
  .register(
    AureliaConfigurationConfiguration,
    AureliaApiConfiguration.configure(cfg => {
      cfg.register('manuallyConfiguredEndpoint', 'https://api.daas.selfip.net');
    })
  ).app(MyApp)
  .start();
