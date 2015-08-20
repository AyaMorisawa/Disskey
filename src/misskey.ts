/* The MIT License | Copyright (c) 2015 Aya */

import * as request from 'request-promise';
import open = require('open');

export namespace sauth {	
	export interface IGetUserKeyResult {
		userKey: string;
		user: any;
	}

	export var baseUrl = 'https://api.misskey.xyz';
	
	export class Session {
		private _appKey: string;
		public get appKey(): string {
			return this._appKey;
		}
		
		private _sessionKey: string;
		public get sessionKey(): string {
			return this._sessionKey;
		}
		
		constructor(appKey: string, sessionKey: string) {
			this._appKey = appKey;
			this._sessionKey = sessionKey;
		}
		
		openAuthorizePage() {
			open(`${baseUrl}/authorize@${this.sessionKey}`);
		}
		
		getUserKey(pincode: string): Promise<IGetUserKeyResult> {
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
