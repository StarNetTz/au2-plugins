import {ApiEndpoints} from '../src/ApiEndpoints';
import {IRestFactory} from '../src/RestFactory'
import * as sinon from "ts-sinon";
import { IRest } from '../src/Rest';
import { HttpClientConfiguration } from 'aurelia';

const stubInterface = sinon.stubInterface;

describe('ApiEndpoints unti tests', function() {
    test('Should register using url and defaults', async function() {
       const apis = new ApiEndpoints(createRestFactoryMock());
       apis.register('myApi', 'http://my-api.com');

       const ep = apis.get('myApi');
   
       expect(ep).toBeDefined();
    });

    test('Should register using configuration unction and defaults', async function() {
        const apis = new ApiEndpoints(createRestFactoryMock());
        apis.registerUsingCallback('myApi', (cfg: HttpClientConfiguration) => {
            return cfg.withBaseUrl("http://api.com");
        });
 
        const ep = apis.get('myApi');
    
        expect(ep).toBeDefined();
     });
});

function createRestFactoryMock(){
    const testStub = stubInterface<IRestFactory>()
    testStub.create.returns(createRestMock());
    testStub.createUsingCallback.returns(createRestMock());
    return testStub;
}

function createRestMock(){
    return stubInterface<IRest>()
}