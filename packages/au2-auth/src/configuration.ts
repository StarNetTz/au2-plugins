import { IContainer, DI, Registration } from "@aurelia/kernel";

export interface IAuthConfigOptions {
  httpInterceptor: boolean;
  loginOnSignup: boolean;
  baseUrl: string;
  loginRedirect: string;
  logoutRedirect: string;
  signupRedirect: string;
  loginUrl: string;
  signupUrl: string;
  profileUrl: string;
  loginRoute: string;
  signupRoute: string;
  tokenRoot: string;
  tokenName: string;
  idTokenName: string;
  tokenPrefix: string;
  responseTokenProp: string;
  responseIdTokenProp: string;
  unlinkUrl: string;
  unlinkMethod: string;
  authHeader: string;
  authToken: string;
  withCredentials: boolean;
  platform: string;
  storage: string;
  providers: unknown;
}

export const IAuthConfigOptions = DI.createInterface<IAuthConfigOptions>("IAuthConfigOptions");

export class DefaultAuthConfigOptions implements IAuthConfigOptions {
  httpInterceptor: boolean;
  loginOnSignup: boolean;
  baseUrl: string;
  loginRedirect: string;
  logoutRedirect: string;
  signupRedirect: string;
  loginUrl: string;
  signupUrl: string;
  profileUrl: string;
  loginRoute: string;
  signupRoute: string;
  tokenRoot: string;
  tokenName: string;
  idTokenName: string;
  tokenPrefix: string;
  responseTokenProp: string;
  responseIdTokenProp: string;
  unlinkUrl: string;
  unlinkMethod: string;
  authHeader: string;
  authToken: string;
  withCredentials: boolean;
  platform: string;
  storage: string;
  providers: unknown;

  constructor(){
  this.httpInterceptor = true;
  this.loginOnSignup = true;
  this.baseUrl= "/";
  this.loginRedirect= "#/";
  this.logoutRedirect= "#/";
  this.signupRedirect= "#/login";
  this.loginUrl = "/auth/login";
  this.signupUrl = "/auth/signup";
  this.profileUrl= "/auth/me";
  this.loginRoute= "/login";
  this.signupRoute= "/signup";
  this.tokenRoot= undefined;
  this.tokenName= "token";
  this.idTokenName= "id_token";
  this.tokenPrefix= "aurelia";
  this.responseTokenProp= "access_token";
  this.responseIdTokenProp= "id_token";
  this.unlinkUrl= "/auth/unlink/";
  this.unlinkMethod= "get";
  this.authHeader= "Authorization";
  this.authToken= "Bearer";
  this.withCredentials= true;
  this.platform= "browser";
  this.storage= "localStorage";
    this.providers = {
      identSrv: {
        name: "identSrv",
        url: "/auth/identSrv",
        redirectUri:  window.location.origin ||  window.location.protocol + "//" + window.location.host,
        scope: ["profile", "openid"],
        responseType: "code",
        scopePrefix: "",
        scopeDelimiter: " ",
        requiredUrlParams: ["scope", "nonce"],
        optionalUrlParams: ["display", "state"],
        state: function () {
          let rand = Math.random().toString(36).substr(2);
          return encodeURIComponent(rand);
        },
        display: "popup",
        type: "2.0",
        clientId: "jsClient",
        nonce: function () {
          let val = ((Date.now() + Math.random()) * Math.random())
            .toString()
            .replace(".", "");
          return encodeURIComponent(val);
        },
        popupOptions: { width: 452, height: 633 },
      },
      google: {
        name: "google",
        url: "/auth/google",
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/auth",
        redirectUri:
          window.location.origin ||
          window.location.protocol + "//" + window.location.host,
        scope: ["profile", "email"],
        scopePrefix: "openid",
        scopeDelimiter: " ",
        requiredUrlParams: ["scope"],
        optionalUrlParams: ["display", "state"],
        display: "popup",
        type: "2.0",
        state: function () {
          let rand = Math.random().toString(36).substr(2);
          return encodeURIComponent(rand);
        },
        popupOptions: {
          width: 452,
          height: 633,
        },
      },
      facebook: {
        name: "facebook",
        url: "/auth/facebook",
        authorizationEndpoint: "https://www.facebook.com/v2.3/dialog/oauth",
        redirectUri:
          window.location.origin + "/" ||
          window.location.protocol + "//" + window.location.host + "/",
        scope: ["email"],
        scopeDelimiter: ",",
        nonce: function () {
          return Math.random();
        },
        requiredUrlParams: ["nonce", "display", "scope"],
        display: "popup",
        type: "2.0",
        popupOptions: {
          width: 580,
          height: 400,
        },
      },
      linkedin: {
        name: "linkedin",
        url: "/auth/linkedin",
        authorizationEndpoint:
          "https://www.linkedin.com/uas/oauth2/authorization",
        redirectUri:
          window.location.origin ||
          window.location.protocol + "//" + window.location.host,
        requiredUrlParams: ["state"],
        scope: ["r_emailaddress"],
        scopeDelimiter: " ",
        state: "STATE",
        type: "2.0",
        popupOptions: {
          width: 527,
          height: 582,
        },
      },
      github: {
        name: "github",
        url: "/auth/github",
        authorizationEndpoint: "https://github.com/login/oauth/authorize",
        redirectUri:
          window.location.origin ||
          window.location.protocol + "//" + window.location.host,
        optionalUrlParams: ["scope"],
        scope: ["user:email"],
        scopeDelimiter: " ",
        type: "2.0",
        popupOptions: {
          width: 1020,
          height: 618,
        },
      },
      yahoo: {
        name: "yahoo",
        url: "/auth/yahoo",
        authorizationEndpoint:
          "https://api.login.yahoo.com/oauth2/request_auth",
        redirectUri:
          window.location.origin ||
          window.location.protocol + "//" + window.location.host,
        scope: [],
        scopeDelimiter: ",",
        type: "2.0",
        popupOptions: {
          width: 559,
          height: 519,
        },
      },
      twitter: {
        name: "twitter",
        url: "/auth/twitter",
        authorizationEndpoint: "https://api.twitter.com/oauth/authenticate",
        type: "1.0",
        popupOptions: {
          width: 495,
          height: 645,
        },
      },
      live: {
        name: "live",
        url: "/auth/live",
        authorizationEndpoint: "https://login.live.com/oauth20_authorize.srf",
        redirectUri:
          window.location.origin ||
          window.location.protocol + "//" + window.location.host,
        scope: ["wl.emails"],
        scopeDelimiter: " ",
        requiredUrlParams: ["display", "scope"],
        display: "popup",
        type: "2.0",
        popupOptions: {
          width: 500,
          height: 560,
        },
      },
      instagram: {
        name: "instagram",
        url: "/auth/instagram",
        authorizationEndpoint: "https://api.instagram.com/oauth/authorize",
        redirectUri:
          window.location.origin ||
          window.location.protocol + "//" + window.location.host,
        requiredUrlParams: ["scope"],
        scope: ["basic"],
        scopeDelimiter: "+",
        display: "popup",
        type: "2.0",
        popupOptions: {
          width: 550,
          height: 369,
        },
      }
    };
  }
  

  public static register(container: IContainer) {
		Registration.singleton(IAuthConfigOptions, this).register(container);
	}
};