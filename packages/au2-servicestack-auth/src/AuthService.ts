import { DI } from "@aurelia/kernel";
import { IApiEndpoints } from "@starnetbih/au2-api";

export interface ICredentials {
	username: string;
	email: string;
	password: string;
}

export interface IUserProfile {
	displayName: string;
	roles: string[];
	permissions: string[];

}

export interface IAuthService {
	signIn(credentials: Partial<ICredentials>): Promise<IUserProfile>;
}

export const IAuthService = DI.createInterface<IAuthService>("IAuthService", x => x.singleton(AuthService));

export class AuthService implements IAuthService {
	constructor(@IApiEndpoints private ApiEndpoints:IApiEndpoints)
	{}
	
	async signIn(credentials: Partial<ICredentials>): Promise<IUserProfile> {
		const authEndpoint = this.ApiEndpoints.get('authApi');
		const resp = await authEndpoint.post({ resource:'/auth/credentials', body:credentials, options : {credentials:"include"}}) as IUserProfile;
		return resp;
	}
}
