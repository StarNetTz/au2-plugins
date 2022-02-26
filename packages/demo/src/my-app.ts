import { IAppConfiguration } from '@starnetbih/au2-configuration';

export class MyApp {
  constructor(@IAppConfiguration private Configuration: IAppConfiguration) { }

  async attached() {
    console.log(await this.Configuration.get('url'));
    console.log(await this.Configuration.get('ab.x'));
  }
  public message = 'Hello World!';
}
