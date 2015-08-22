/* The MIT License | Copyright (c) 2015 Aya */

import * as request from 'request-promise';
import open = require('open');

export var baseUrl = 'https://api.misskey.xyz';

export function callApi<T>(endpoint: string, options: request.Options = {}): Promise<T> {
	options.url = `${baseUrl}/${endpoint}`;
	options.json = true;
	return request(options);
}

export namespace SAuth {
	type User = any;

	export class Session {
		appKey: string;
		sessionKey: string;
		authorizePageUrl: string;

		static createSessionKey(appKey: string) {
			return callApi<string>('sauth/get-authentication-session-key', {
				method: 'GET',
				headers: {
					'sauth-app-key': appKey
				},
				transform: (data: { authenticationSessionKey: string }): string => {
					return data.authenticationSessionKey;
				}
			});
		}

		static create(appKey: string): Promise<Session> {
			return Session.createSessionKey(appKey)
				.then(sessionKey => new Session(appKey, sessionKey));
		}

		constructor(appKey: string, sessionKey: string) {
			this.appKey = appKey;
			this.sessionKey = sessionKey;
			this.authorizePageUrl = `${baseUrl}/authorize@${encodeURIComponent(sessionKey)}`;
		}

		openAuthorizePage() {
			open(this.authorizePageUrl);
		}

		getUserKey(pincode: string) {
			return callApi<string>('sauth/get-user-key', {
				method: 'GET',
				headers: {
					'sauth-app-key': this.appKey
				},
				form: {
					'authentication-session-key': this.sessionKey,
					'pin-code': pincode
				},
				transform: (data: { userKey: string }): string => data.userKey
			});
		}
	}
}

export class Token {
	appKey: string;
	userKey: string;

	static create(session: SAuth.Session, pincode: string) {
		return session.getUserKey(pincode).then(userKey => new Token(session.appKey, userKey));
	}

	constructor(appKey: string, userKey: string) {
		this.appKey = appKey;
		this.userKey = userKey;
	}
	
	callApiWithHeader<T>(endpoint: string, options: request.Options) {
		options.headers['sauth-app-key'] = this.appKey;
		options.headers['sauth-user-key'] = this.userKey;
		return callApi<T>(endpoint, options);
	}
}
