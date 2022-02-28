# au2-configuration

This library is a partial port of the aurelia-configuration plugin.

It is initialized during AppTask.beforeCreate step so any plugins that might depend on it should initialize at later time in the pipeline.

**Full disclosure**: this plugin is in alpha stage. Use at your own risk.

## Installation
`npm install @starnetbih/au2-configuration` or `yarn add @starnetbih/au2-configuration`

## Configuration

Inside of your main.ts/main.js file register the plugin on the register method:

```js
import { AppConfigurationPlugin } from '@starnetbih/au2-configuration';

Aurelia.register(AppConfigurationPlugin); 

//Or configure
Aurelia.register(
    AppConfigurationPlugin.configure( cfg => {
        cfg.dir = 'mydir';
        cfg.file= 'myfile.json';
    })
);

```
### Default configuration conventions
Make sure that your src directory contains **config** directory with **config.json** file in it.
So:
- app
  - src
    - config
      - config.json

config.json example
```js
{
	"objKey1": {
		"subObj1": {
			"prop1": "some string value"
		}
	}
}
```
### Setup your webpack.config.js
Make sure that you have `copy-webpack-plugin` installed

`npm install copy-webpack-plugin --save-dev` or `yarn add -D copy-webpack-plugin`

Configure *copy-webpack-plugin* so it copies your configuration do dist directory.
```js
/*Import plugin*/
const CopyWebpackPlugin = require('copy-webpack-plugin');

/*Initialize variables*/
const srcDir = path.resolve(__dirname, 'src');
const outDir = path.resolve(__dirname, 'dist');

/*Add CopyWebpackPlugin to plugins array*/
plugins: [
      new HtmlWebpackPlugin({ template: 'index.html' }),
      new Dotenv({
        path: `./.env${production ? '' :  '.' + (process.env.NODE_ENV || 'development')}`,
      }),
      analyze && new BundleAnalyzerPlugin(),
      new CopyWebpackPlugin({
        patterns:[
        { from: srcDir +'/config', to: outDir + '/config' }
      ]})
    ].filter(p => p)
```

## Usage

```js
import { IAppConfiguration } from '@starnetbih/au2-configuration';

export class MyApp {

    constructor( @IAppConfiguration private Configuration: IAppConfiguration ) { }

    async attached() {
        var cfg = this.Configuration.get('objKey1');
        console.log(cfg);
    }
}
```