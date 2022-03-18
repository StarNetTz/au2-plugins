import { BrowserPlatform } from '@aurelia/platform-browser';
import { setPlatform } from '@aurelia/testing';
import { Aurelia, CustomElement, IWindow } from '@aurelia/runtime-html';
import { TestContext } from '@aurelia/testing';
import { AureliaConfigurationConfiguration } from '../src/AureliaConfigurationConfiguration';
import { Registration } from '@aurelia/kernel';
import { IAureliaConfigurationOptions } from '../src/AureliaConfigurationOptions';
import fetch from 'node-fetch';

import * as sinon from "ts-sinon";
import { IHttpClient } from 'aurelia';

const stubInterface = sinon.stubInterface;

function createStub() {
    const testStub = stubInterface<IHttpClient>()
    const rsp = new fetch.Response('{"prop":"val"}');
    testStub.fetch.resolves(rsp);
    return testStub;
}

const winStub = {
    location: {
        protocol: 'zttp://'
    }
};


const platform = new BrowserPlatform(window);
setPlatform(platform);
BrowserPlatform.set(globalThis, platform);



test('Should register and re-configure', async () => {
    const ctx = TestContext.create();
    const au = new Aurelia(ctx.container);

    const host = ctx.createElement('body');
    const ShellComponent = CustomElement.define(
        { name: 'shellComponent' },
        class ShellComponentModel { }
    );
    const shell = new ShellComponent();

    const clientStub = createStub();

    au.register(
        Registration.instance(IHttpClient, clientStub),
        Registration.instance(IWindow, winStub));
    au.register(AureliaConfigurationConfiguration.configure({ dir: 'mydir', file: 'myfile' }));
    au.app({ host, component: shell });

    await au.start();

    const cmp = ctx.container.get(IAureliaConfigurationOptions);

    expect(cmp.dir).toBe('mydir');
    expect(cmp.file).toBe('myfile');
});