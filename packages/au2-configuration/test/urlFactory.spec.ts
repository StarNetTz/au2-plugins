import {UrlFactory} from '../src/UrlFactory'
import { DefaultAureliaConfigurationOptions } from '../src/AureliaConfigurationOptions';
import { IWindow } from '@aurelia/runtime-html';

const winStub = {
    location:{
        protocol:'zttp://api.com'
    }
};

test('Passes', async () => {
    const url = UrlFactory.create(winStub as IWindow, DefaultAureliaConfigurationOptions);
    return expect(url).toBe("zttp://api.com/config/config.json");
});