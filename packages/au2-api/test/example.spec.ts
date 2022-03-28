import { BrowserPlatform } from '@aurelia/platform-browser';
import { setPlatform } from '@aurelia/testing';
import {ApiEndpoints} from '../src/ApiEndpoints'


const platform = new BrowserPlatform(window);
setPlatform(platform);
BrowserPlatform.set(globalThis, platform);
import { assert } from '@aurelia/testing';
import { Rest } from '../src/Rest';

// An assumption is being made you called the code defined in the first part
// of these docs to set up the environment.

describe('Endpoints tests', function() {
    it('Should register endpoint', async function() {
        const eps = new ApiEndpoints();

        eps.registerEndpoint('authApi', 'https://www.authapi.com');

        const apiEndpoint = eps.getEndpoint('authApi');

        assert.instanceOf(apiEndpoint, Rest);
    });
});

