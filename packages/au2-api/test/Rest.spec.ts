
import { IHttpClient } from "@aurelia/fetch-client";
import * as sinon from "ts-sinon";
import { IRestRequest, Rest } from '../src/Rest';
import fetch from 'node-fetch';


const stubInterface = sinon.stubInterface;

describe('Find with url string as an argument', function () {
    test('Should return expected response', async () => {
        const rst = new Rest(createIHttpClientMock(), "myApi");

        const rsp = await rst.find("http://www.myapi.com/users/1") as object;

        expect(rsp['name']).toBe('john');
    });
});

describe('Find with IRestRequest as an argument', function () {

    test('Should return with resource', async () => {
        const rst = new Rest(createIHttpClientMock(), "myApi");
        const req: IRestRequest = {
            resource: "http://www.myapi.com/users/1"
        };

        const rsp = await rst.find(req) as object;

        expect(rsp['name']).toBe('john');
    });

    test('Should return with resource and criteria', async () => {
        const rst = new Rest(createIHttpClientMock(), "myApi");

        const req: IRestRequest = {
            resource: "http://www.myapi.com",
            idOrCriteria:"/users/2"
        };

        const rsp = await rst.find(req) as object;

        expect(rsp['name']).toBe('doe');
    });
});

function createIHttpClientMock() {
    const testStub = stubInterface<IHttpClient>()

    testStub.fetch.withArgs('http://www.myapi.com/users/1').resolves(new fetch.Response('{"name":"john"}'));
    testStub.fetch.withArgs('http://www.myapi.com/users/2').resolves(new fetch.Response('{"name":"doe"}'));
    testStub.fetch.resolves(new fetch.Response('{"prop":"val"}'));
    return testStub;
}

