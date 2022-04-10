# au2-servicestack-auth

Aurelia 2 auth library for servicestack. JWT Tokens are maintained via Secure HttpOnly Cookies.
This plugin depends on:
- @starnetbih/au2-configuration
- @starnetbih/au2-api

Make sure that your src directory contains **config** directory with **config.json** file in it.
So:

- app
  - src
    - config
      - config.json

Add 'au2-api' section with key 'authApi' with url and auth set to true.

config.json example

```js
{
 "au2-api": {
  "authApi": {
   "url": "https://localhost:5010",
   "auth": true
  }
 }
}
```

**Full disclosure**: this plugin is in alpha stage. Use at your own risk.

## Installation

`npm install @starnetbih/au2-servicestack-auth` or `yarn add @starnetbih/au2-servicestack-auth`

## Usage

```js
import { IAuthService, IUserProfile, SS_AUTH_CHANNEL_SIGNED_IN, SS_AUTH_CHANNEL_SIGNED_OUT } from '@starnetbih/au2-servicestack-auth';
import { IEventAggregator } from 'aurelia';

export class MyApp {
 constructor(
    @IAuthService private Auth: IAuthService,
    @IEventAggregator readonly EventAggregator: IEventAggregator) {
        this.EventAggregator.subscribe(SS_AUTH_CHANNEL_SIGNED_IN, (usr) => {
            console.log(`${(usr as IUserProfile).displayName} signed in!`);
            console.log(usr);
        });
        this.EventAggregator.subscribe(SS_AUTH_CHANNEL_SIGNED_OUT, () => {
            console.log('User signed out');
        });
    }

    async attached() {
       await this.Auth.signIn({ username: "admin", password: "admin" });
       await this.Auth.signOut();
    }
}
```
