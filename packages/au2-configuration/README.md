# au2-configuration

This library is a partial port of the aurelia-configuration plugin.

**Full disclosure**: this plugin is in alpha stage. Use at your own risk.

## Installation

`npm install @starnetbih/au2-configuration` or `yarn add @starnetbih/au2-configuration`

## Configuration

Inside of your main.ts/main.js file register the plugin on the register method:

```js
import { AureliaConfigurationConfiguration } from '@starnetbih/au2-configuration';

Aurelia.register(AureliaConfigurationConfiguration); 

//Or configure
Aurelia.register(
    AureliaConfigurationConfiguration.configure({ dir: 'mydir', file: 'myfile' })
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
 "obj": {
  "sub": {
   "prop": "value"
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
import { IAureliaConfiguration } from '@starnetbih/au2-configuration';

export class MyApp {

    constructor( @IAureliaConfiguration private cfg: IAureliaConfiguration ) { }

    async attached() {
        console.log(this.cfg.get('obj.sub.prop'));
    }
}
```
