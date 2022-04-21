import { DI, IEventAggregator } from "@aurelia/kernel";
import { IApiEndpoints } from "@starnetbih/au2-api";
import { SS_AUTH_CHANNEL_SIGNED_IN, SS_AUTH_CHANNEL_SIGNED_OUT } from "consts";

export interface ICredentials {
	username: string;
	email: string;
	password: string;
}

export interface IUserProfile {
	userId: string;
	userName: string;
	displayName: string;
	email: string;
	sessionId: string;
	roles: string[];
	permissions: string[];
}

export interface IServiceAuthStackResponse {
	userId: string;
	userName: string;
	displayName: string;
	email: string;
	sessionId: string;
	roles: string[];
	permissions: string[];
	profileUrl: string;
	meta:Map<string,string>
}

export interface IRegisterUserRequest {
	userName?: string;
	firstName?: string;
	lastName?: string;
	displayName?: string;
	email?: string;
    password?: string;
    confirmPassword?: string;
	meta?:Map<string,string>;
	errorView?: string;
	autoLogin?: boolean;
}

export interface IUserStatus {
	exists:boolean;
}

export interface IAuthService {
	signIn(credentials: Partial<ICredentials>): Promise<void>;
	signOut(): Promise<void>;
	register(req: IRegisterUserRequest): Promise<void>;
	getStatus(usernameOrEmail:string): Promise<IUserStatus>;

}

/*istanbul ignore next*/
export const IAuthService = DI.createInterface<IAuthService>("IAuthService", x => x.singleton(AuthService));

export class AuthService implements IAuthService {
	constructor(
		@IApiEndpoints private ApiEndpoints: IApiEndpoints,
		@IEventAggregator private EA: IEventAggregator
	) { }

	async register(req: IRegisterUserRequest): Promise<void> {
		const api = this.ApiEndpoints.get('authApi');
		const resp = await api.post({ resource: '/register', body: req }) as IServiceAuthStackResponse;
		const profile : IUserProfile = {
			userId: resp.userId, 
			userName: resp.userName,
			sessionId: resp.sessionId,
			displayName: req.displayName,
			email: resp.meta["email"],
			roles: resp.roles,
			permissions: resp.permissions
		}
		this.EA.publish(SS_AUTH_CHANNEL_SIGNED_IN, profile);
	}

	async signIn(credentials: Partial<ICredentials>) {
		const api = this.ApiEndpoints.get('authApi');
		const resp = await api.post({ resource: '/auth/credentials', body: credentials }) as IServiceAuthStackResponse;
		const profile : IUserProfile = {
			userId: resp.userId, 
			userName: resp.userName,
			sessionId: resp.sessionId,
			displayName: resp.displayName,
			email: resp.meta["email"],
			roles: resp.roles,
			permissions: resp.permissions
		}
		this.EA.publish(SS_AUTH_CHANNEL_SIGNED_IN, profile);
	}

	async signOut(): Promise<void> {
		const api = this.ApiEndpoints.get('authApi');
		const resp = await api.find({ resource: '/auth/logout' });
		this.EA.publish(SS_AUTH_CHANNEL_SIGNED_OUT, resp);
	}

	async getStatus(usernameOrEmail:string): Promise<IUserStatus> {
		const api = this.ApiEndpoints.get('authApi');
		const resp = await api.find({ resource: '/user',  idOrCriteria:{ usernameOrEmail:usernameOrEmail} }) as IUserStatus;
		return resp;
	}
}
