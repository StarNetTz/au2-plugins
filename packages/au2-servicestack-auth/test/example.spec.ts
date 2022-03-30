import {AuthService} from '../src/index'


test('Shouldsign in', async () => {
    const svc = new AuthService();
    const rsp = await svc.signIn({username:"admin", password:"admin"});
    expect(rsp.displayName).toBe("John");
});