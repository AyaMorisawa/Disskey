/* The MIT License | Copyright (c) 2015 Aya */

import * as request from 'request-promise';
import open = require('open');

export var baseUrl = 'https://api.misskey.xyz';

export function callApi<T>(endpoint: string, options: request.Options = {}): Promise<T> {
	options.url = `${baseUrl}/${endpoint}`;
	options.json = true;
	return request(options);
}

export type User = any;

export namespace SAuth {
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
	status: StatusApi;
	users: UsersApi;

	static create(session: SAuth.Session, pincode: string) {
		return session.getUserKey(pincode).then(userKey => new Token(session.appKey, userKey));
	}

	constructor(appKey: string, userKey: string) {
		this.appKey = appKey;
		this.userKey = userKey;
		this.status = new StatusApi(this);
		this.users = new UsersApi(this);
	}

	callApiWithHeaders<T>(endpoint: string, options: request.Options = {}) {
		if (options.headers === void 0) {
			options.headers = {};
		}

		options.headers['sauth-app-key'] = this.appKey;
		options.headers['sauth-user-key'] = this.userKey;
		return callApi<T>(endpoint, options);
	}
}

export class MisskeyApi {
	token: Token;

	constructor(token: Token) {
		this.token = token;
	}
}

export class StatusApi extends MisskeyApi {
	getTimeline(options: {sinceCursor?: number, maxCursor?: number, count?: number} = {}) {
		return this.token.callApiWithHeaders<any>('status/timeline', {
			method: 'GET',
			form: {
				'since-cursor': typeof options.sinceCursor === 'number' ? options.sinceCursor.toString() : void 0,
				'max-cursor': typeof options.maxCursor === 'number' ? options.maxCursor.toString() : void 0,
				count: typeof options.count === 'number' ? options.count.toString() : void 0
			}
		});
	}

	update(text: string, inReplyToStatusId?: number) {
		return this.token.callApiWithHeaders<any>('status/update', {
			method: 'POST',
			form: {
				text,
				'in-reply-to-status-id': typeof inReplyToStatusId === 'number' ? inReplyToStatusId.toString() : void 0
			}
		});
	}

	show(id: string) {
		return this.token.callApiWithHeaders<any>('status/show', {
			method: 'GET',
			form: {
				'status-id': id
			}
		});
	}

	repost(id: string, text?: string) {
		return this.token.callApiWithHeaders<any>('status/repost', {
			method: 'POST',
			form: {
				'status-id': id,
				text: typeof text === 'string' ? text : void 0
			}
		});
	}

	favorite(id: string) {
		return this.token.callApiWithHeaders<any>('status/favorite', {
			method: 'POST',
			form: {
				'status-id': id
			}
		});
	}
}

export class UsersApi extends MisskeyApi {
	showById(id: string) {
		return this.token.callApiWithHeaders<any>('users/show', {
			method: 'GET',
			form: {
				'user-id': id
			}
		});
	}

	showByScreenName(screenName: string) {
		return this.token.callApiWithHeaders<any>('users/show', {
			method: 'GET',
			form: {
				'screen-name': screenName
			}
		});
	}

	follow(id: string) {
		return this.token.callApiWithHeaders<any>('users/follow', {
			method: 'POST',
			form: {
				'user-id': id
			}
		});
	}

	unfollow(id: string) {
		return this.token.callApiWithHeaders<any>('users/unfollow', {
			method: 'DELETE',
			form: {
				'user-id': id
			}
		});
	}
}
