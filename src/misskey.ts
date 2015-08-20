/* The MIT License | Copyright (c) 2015 Aya */

import * as request from 'request-promise';
import open = require('open');

var baseUrl = 'https://api.misskey.xyz';

export namespace sauth {
	export interface IGetUserKeyResult {
		userKey: string;
		user: any;
	}

	export function getSessionKey(appKey: string): Promise<string> {
		return request({
			url: `${baseUrl}/sauth/get-authentication-session-key`,
			method: 'GET',
			headers: {
				'sauth-app-key': appKey
			},
			json: true,
			transform: (data: { authenticationSessionKey: string }): any => {
				return data.authenticationSessionKey;
			}
		});
	}

	export function openAuthorizePage(sessionKey: string) {
		open(`${baseUrl}/authorize@${sessionKey}`);
	}

	export function getUserKey(appKey: string, sessionKey: string, pincode: string): Promise<IGetUserKeyResult> {
		return request({
			url: `${baseUrl}/sauth/get-user-key`,
			method: 'GET',
			headers: {
				'sauth-app-key': appKey
			},
			form: {
				'authentication-session-key': sessionKey,
				'pin-code': pincode
			},
			json: true
		});
	}
}
