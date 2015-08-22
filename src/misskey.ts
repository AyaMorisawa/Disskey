/* The MIT License | Copyright (c) 2015 Aya */

import * as request from 'request-promise';
import open = require('open');

export namespace SAuth {
	type User = any;

	export var baseUrl = 'https://api.misskey.xyz';

	export function callApi<T>(endpoint: string, option: request.Options = {}): Promise<T> {
		option.url = `${baseUrl}/${endpoint}`;
		option.json = true;

		return request(option);
	}

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
			return callApi<{userKey: string, user: User}>('sauth/get-user-key', {
				method: 'GET',
				headers: {
					'sauth-app-key': this.appKey
				},
				form: {
					'authentication-session-key': this.sessionKey,
					'pin-code': pincode
				}
			});
		}
	}
}
