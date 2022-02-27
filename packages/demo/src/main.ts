import {Aurelia, Registration, AppTask}  from 'aurelia';
import { MyApp } from './my-app';
import { AppConfigurationPlugin } from '@starnetbih/au2-configuration';
import { ApiPlugin } from '@starnetbih/au2-api';

Aurelia
.register(
  AppConfigurationPlugin.customize(
    settings => {
      settings.Dir = "config"
      settings.File = "config.json"
    }),
    ApiPlugin.customize(
      (reg) => {
        reg.registerEndpoint('api', 'https://api.daas.selfip.net');
      }),
  AppTask.beforeActivate(() => {
    console.log('Before activate app');
})
).app(MyApp)
  .start();
