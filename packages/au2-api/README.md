# au2-api

This library is a partial port of the excellent SpoonX/aurelia-api plugin for the Aurelia platform. It contains support for multiple endpoints, extending the functionalities supplied by aurelia HttpClient.

au2-api is a module wrapped around HttpClient that allows you to:

- Supply criteria for your api
- Manage more than one endpoint
- Add defaults
- Add interceptors
- And more

It depends on **au2-configuration**.

**Full disclosure**: this plugin is in alpha stage. Use at your own risk.

## Installation

`npm install @starnetbih/au2-api` or `yarn add @starnetbih/au2-api`

## Configure your app

Inside of your main.ts/main.js file register the plugin on the register method:

```js
import { AureliaApiConfiguration } from '@starnetbih/au2-api';

/* Configure in code */
Aurelia.register(AureliaApiConfiguration.configure(cfg => {
        cfg.register('myApi1', '/mypath');
        cfg.registerUsingCallback('myApi2', (cfg) => {
           return cfg.withBaseUrl('/mypath'l)
          },
          { headers: {'Accept': 'application/json'}
        );
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

Setting auth to true will include credentials with requests.  

## Usage

```js
import { IApiEndpoints } from '@starnetbih/au2-api';

export class MyApp {

    constructor(@IApiEndpoints private ApiEndpoints: IApiEndpoints) { }

    async attached() {
         const rest = this.ApiEndpoints.get('myApi1');
         const resp = await rest.find('/ba/entities?pageSize=10');
         console.log(resp);

         const req = {
            currentPage: 0,
            pageSize: 10,
            qry: {
                "name": "filterByName",
                "startsWith ": "Ag"
            }
        };
        const resp2 = await rest.post({ resource: '/typeaheads', body: req });
        console.log(resp2);
    }
}
```
