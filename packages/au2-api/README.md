# au2-api

This library is a partial port of the excellent SpoonX/aurelia-api plugin for the Aurelia platform. It contains support for multiple endpoints, extending the functionalities supplied by aurelia HttpClient.

au2-api is a module wrapped around HttpClient that allows you to:

- Supply criteria for your api
- Manage more than one endpoint
- Add defaults
- Add interceptors
- And more

It depends on **au2-configuration** and **au2-auth** modules for configuration and authorization features.

**Full disclosure**: this plugin is in alpha stage. Use at your own risk.

## Installation

`npm install @starnetbih/au2-api` or `yarn add @starnetbih/au2-api`

## Configure your app

Inside of your main.ts/main.js file register the plugin on the register method:

```js
import { AureliaApiConfiguration } from '@starnetbih/au2-api';

/* Configure in code */
Aurelia.register(AureliaApiConfiguration.configure(cfg => {
        cfg.registerEndpoint('myApi1', '/mypath');
        cfg.registerEndpoint('myApi2', '/otherpath', { headers: {'Content-Type':'x-www-form-urlencoded'}});
    }));

/* Or configure by convention, using au2-configuration plugin */
Aurelia.register(AureliaApiConfiguration); 
```

#### Configure using configuration

Make sure that your config.json used by au2-configuration plugin contains **au2-api** section:

```js
{
 "au2-api": {
  "myApi1": {
   "url": "http://localhost:5005"
  },
  "myApi2": {
   "url": "http://localhost:5000",
   "auth": true
  }
 }
}
```

au2-auth plugin takes care of adding the jwt token to all requests on endpoints with "auth" set to true.

## Usage

```js
import { IApiRegistry } from '@starnetbih/au2-api';

export class MyApp {

    constructor(@IApiRegistry private Reg: IApiRegistry) { }

    async attached() {
         let rest = this.Reg.getEndpoint('myApi1');
         let resp = await rest.find({ resource: '/ba/entities?pageSize=10' });
         console.log(resp);

         let req = {
            currentPage: 0,
            pageSize: 10,
            qry: {
                "name": "filterByName",
                "startsWith ": "Ag"
            }
        };
        let resp2 = await rest.post({ resource: '/typeaheads', body: req });
        console.log(resp2);
    }
}
```
