
import {AureliaConfiguration} from '../src/AureliaConfiguration'
import fetch from 'node-fetch';
import { IHttpClient } from '@aurelia/fetch-client';
import { DefaultAureliaConfigurationOptions } from '../src/AureliaConfigurationOptions';
import { IWindow } from '@aurelia/runtime-html';
import * as sinon from "ts-sinon";
const stubInterface = sinon.stubInterface;


test('get called with valid key should return value', async () => {
    const ts = new AureliaConfiguration(createIHttpClientMock(), DefaultAureliaConfigurationOptions , winStub as IWindow);
    
    await ts.init();

    await expect(await ts.get("prop")).toBe("val");
});

test('get called with invalid key should throw', async () => {
    const ts = new AureliaConfiguration(createIHttpClientMock(), DefaultAureliaConfigurationOptions, winStub as IWindow);

    await ts.init();
    
    await expect( ts.get("noKey") ).rejects.toThrow(Error)
});

function createIHttpClientMock(){
    const testStub = stubInterface<IHttpClient>()
    const rsp = new fetch.Response('{"prop":"val"}');
    testStub.fetch.resolves(rsp);
    return testStub;
}

const winStub = {
    location:{
        protocol:'zttp://'
    }
};
