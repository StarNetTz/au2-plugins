
import {AureliaConfiguration} from '../src/AureliaConfiguration'
import fetch from 'node-fetch';

import { IHttpClient } from '@aurelia/fetch-client';
import { DefaultAureliaConfigurationOptions } from '../src/AureliaConfigurationOptions';
import { IWindow } from '@aurelia/runtime-html';
import * as sinon from "ts-sinon";

const stubInterface = sinon.stubInterface;

function createStub(){
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

test('Should initialize', async () => {
    const ts = new AureliaConfiguration(createStub(), DefaultAureliaConfigurationOptions , winStub as IWindow);
    
    await ts.init();

    await expect(await ts.get("prop")).toBe("val");
});

test('NoKey should throw', async () => {
    const ts = new AureliaConfiguration(createStub(), DefaultAureliaConfigurationOptions, winStub as IWindow);

    await ts.init();
    
    await expect( ts.get("noKey") ).rejects.toThrow(Error)
});