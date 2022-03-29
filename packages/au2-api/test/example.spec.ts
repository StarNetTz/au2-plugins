import {ApiEndpoints} from '../src/ApiEndpoints';
import {IRestFactory} from '../src/RestFactory'
import * as sinon from "ts-sinon";
import { IRest, Rest } from '../src/Rest';

const stubInterface = sinon.stubInterface;

describe('ApiEndpoints tests', function() {
    test('Should instantiate ApiEndpoints', async function() {
       const apis = new ApiEndpoints(createRestFactoryMock());
       apis.registerEndpoint('myApi', 'http://my-api.com');
    });
});

function createRestFactoryMock(){
    const testStub = stubInterface<IRestFactory>()
    
    testStub.create.returns(createRestMock());
    return testStub;
}

function createRestMock(){
    const testStub = stubInterface<IRest>()
   
    return testStub;
}

