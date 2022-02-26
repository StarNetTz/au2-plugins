import {Aurelia, Registration, AppTask}  from 'aurelia';
import { MyApp } from './my-app';
import { AppConfigurationPlugin } from '@starnetbih/au2-configuration';

Aurelia
.register(
  AppConfigurationPlugin.customize(
    settings => {
      settings.Dir = "config"
      settings.File = "config.json"
    }),
  AppTask.beforeActivate(() => {
    console.log('Before activate app');
})
).app(MyApp)
  .start();
