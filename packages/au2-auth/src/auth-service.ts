
import { DI } from "@aurelia/kernel";


export const IAuthService = DI.createInterface<IAuthService>("IAuthService", x => x.singleton(AuthService));


export interface IAuthService {


}

export class AuthService implements IAuthService {

}


export interface SignUpRequest
{
    displayName:string;
    username:string;
    email:string;
    password:string;
}

export interface SignInRequest
{
    username:string;
    email:string;
    password:string;
}