# au2-auth

This library is a based on aurelia2-auth plugin and previous work done by SpoonX.

**Full disclosure**: this plugin is in alpha stage. Use at your own risk.

## Installation

`npm install @starnetbih/au2-auth` or `yarn add @starnetbih/au2-auth`

## Configuration

Inside of your main.ts/main.js file register the plugin on the register method:

```js
import { AureliaAuthPlugin } from '@starnetbih/au2-auth';

Aurelia.register(AureliaAuthPlugin); 

//Or configure
Aurelia.register(
    AureliaAuthPlugin.configure( cfg => {
        cfg.responseTokenProp = 'bearerToken';
    })
);

```
## Usage

```js
import { IAppConfiguration } from '@starnetbih/au2-auth';

export class MyApp {

    constructor( @IAuthService private Auth: IAuthService ) { }

    async attached() {
        let resp = await this.Auth.login({
            credentials: { username: "admin", password: "admin" }
        });
        console.log(this.Auth.getTokenPayload());
    }
}
```
