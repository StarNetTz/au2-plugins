import { DI, IEventAggregator } from "@aurelia/kernel";
import { IApiEndpoints, IRest } from "@starnetbih/au2-api";
import { SS_AUTH_CHANNEL_SIGNED_IN, SS_AUTH_CHANNEL_SIGNED_OUT } from "consts";

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
	signIn(credentials: Partial<ICredentials>): Promise<void>;
	signOut(): Promise<void>;
}

export const IAuthService = DI.createInterface<IAuthService>("IAuthService", x => x.singleton(AuthService));

export class AuthService implements IAuthService {
	constructor(
		@IApiEndpoints private ApiEndpoints:IApiEndpoints,
		@IEventAggregator private EA:IEventAggregator
		)
	{ }

	async signIn(credentials: Partial<ICredentials>) {
		const api = this.ApiEndpoints.get('authApi');
		const resp = await api.post({ resource:'/auth/credentials', body:credentials}) as IUserProfile;
		this.EA.publish(SS_AUTH_CHANNEL_SIGNED_IN, resp);
	}

	async signOut(): Promise<void> {
		const api = this.ApiEndpoints.get('authApi');
		const resp = await api.find({ resource:'/auth/logout'});
		this.EA.publish(SS_AUTH_CHANNEL_SIGNED_OUT, resp);
	}
}
