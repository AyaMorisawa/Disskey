/* The MIT License | Copyright (c) 2015 Aya */

import * as request from 'request-promise';
import open = require('open');

export namespace sauth {
	type User = any;

	export var baseUrl = 'https://api.misskey.xyz';

	export class Session {
		appKey: string;
		sessionKey: string;

		constructor(appKey: string, sessionKey: string) {
			this.appKey = appKey;
			this.sessionKey = sessionKey;
		}

		openAuthorizePage() {
			open(`${baseUrl}/authorize@${this.sessionKey}`);
		}

		getUserKey(pincode: string): Promise<{userKey: string, user: User}> {
			return request({
				url: `${baseUrl}/sauth/get-user-key`,
				method: 'GET',
				headers: {
					'sauth-app-key': this.appKey
				},
				form: {
					'authentication-session-key': this.sessionKey,
					'pin-code': pincode
				},
				json: true
			});
		}
	}

	export function createSession(appKey: string): Promise<Session> {
		return request({
			url: `${baseUrl}/sauth/get-authentication-session-key`,
			method: 'GET',
			headers: {
				'sauth-app-key': appKey
			},
			json: true,
			transform: (data: { authenticationSessionKey: string }): any => {
				return new Session(appKey, data.authenticationSessionKey);
			}
		});
	}
}
