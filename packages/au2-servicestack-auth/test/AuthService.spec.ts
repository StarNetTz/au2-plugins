import { SS_AUTH_CHANNEL_SIGNED_IN, IUserProfile, SS_AUTH_CHANNEL_SIGNED_OUT } from '@starnetbih/au2-servicestack-auth';
import { IRest } from '@starnetbih/au2-api';
import { IEventAggregator } from '@aurelia/kernel';
import { IApiEndpoints } from '@starnetbih/au2-api';
import { AuthService, ICredentials } from './../src/AuthService';
import * as sinon from "ts-sinon";

const stubInterface = sinon.stubInterface;

function createIApiEndpointsMock() {
    const testMock = stubInterface<IApiEndpoints>();
    testMock.get.returns(createIRestMock());
    return testMock;
}

async function getCredentialsMock() {
    return {
        userId: "1",
        userName: "JohnDoe",
        displayName: "John",
        meta: { email: "john@doe.com" },
        sessionId: "1",
        roles: ["admin"],
        permissions: ["admin"],
        profileUrl: "img"
    }
}

function createIRestMock() {
    const testMock = stubInterface<IRest>();
    let credentials = getCredentialsMock();
    testMock.post.returns(credentials);
    testMock.find.returns(credentials);
    return testMock;
}

function createIEventAggregatorMock() {
    const testMock = stubInterface<IEventAggregator>();
    return testMock;
}

function createAdminCredentials(): ICredentials {
    return {
        username: "admin",
        email: "",
        password: "admin"
    };
}

describe('AuthService', function () {
    const eaMock = createIEventAggregatorMock();
    const ts = new AuthService(createIApiEndpointsMock(), eaMock);
    jest.spyOn(eaMock, 'publish');

    test('should publish user profile with SS_AUTH_CHANNEL_SIGNED_IN message if user signs in successfully', async () => {
        let credentials = createAdminCredentials();
        await ts.signIn(credentials);
        const expectedUserProfileResponse: IUserProfile = {
            userId: "1",
            userName: "JohnDoe",
            displayName: "John",
            email: "john@doe.com",
            sessionId: "1",
            roles: ["admin"],
            permissions: ["admin"],
            image: "img"
        }
        expect(eaMock.publish).toBeCalledWith(SS_AUTH_CHANNEL_SIGNED_IN, expectedUserProfileResponse);
    });

    test('should publish SS_AUTH_CHANNEL_SIGNED_OUT message if user signs out successfully', async () => {
        await ts.signOut();
        expect(eaMock.publish).toBeCalledWith(SS_AUTH_CHANNEL_SIGNED_OUT, await getCredentialsMock());
    });

})