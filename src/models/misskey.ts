import {Options as requestOptions} from 'request';
import request from './request-promise';
import { appConfig } from './config';
let open = require('open');
let Kefir = require('kefir');

export function callApi<T>(endpoint: string, options: requestOptions = {}): Promise<T> {
	options.url = `${appConfig.apiBaseUrl}/${endpoint}`;
	return request(options).then(result => <T>JSON.parse(result));
}

export namespace SAuth {
	export class Session {
		appKey: string;
		sessionKey: string;
		authorizePageUrl: string;

		static createSessionKey(appKey: string) {
			return callApi<{ authenticationSessionKey: string }>('sauth/get-authentication-session-key', {
				method: 'GET',
				headers: {
					'sauth-app-key': appKey
				}
			}).then(data => data.authenticationSessionKey);
		}

		static create(appKey: string): Promise<Session> {
			return Session.createSessionKey(appKey)
				.then(sessionKey => new Session(appKey, sessionKey));
		}

		constructor(appKey: string, sessionKey: string) {
			this.appKey = appKey;
			this.sessionKey = sessionKey;
			this.authorizePageUrl = `${appConfig.apiBaseUrl}/authorize@${encodeURIComponent(sessionKey)}`;
		}

		openAuthorizePage() {
			open(this.authorizePageUrl);
		}

		getUserKey(pincode: string) {
			return callApi<{ userKey: string }>('sauth/get-user-key', {
				method: 'GET',
				headers: {
					'sauth-app-key': this.appKey
				},
				form: {
					'authentication-session-key': this.sessionKey,
					'pin-code': pincode
				}
			}).then(data => data.userKey);
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

	callApiWithHeaders<T>(endpoint: string, options: requestOptions = {}) {
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
	createTimelineStream(): any {
		return Kefir.stream((emitter: any) => {
			let isActive = true;
			let lastCursor: number = void 0;
			let f = () => {
				this.getTimeline({sinceCursor: lastCursor})
					.then(statuses => statuses.sort((a, b) => a.cursor - b.cursor))
					.then(statuses => {
						if (statuses.length >= 1) {
							statuses.filter(isNewStatus).forEach(emitter.emit);
							let lastStatus = statuses[statuses.length - 1];
							if (isNewStatus(lastStatus)) {
								lastCursor = lastStatus.cursor;
							}
						}
						function isNewStatus(status: any) {
							return lastCursor === void 0 || status.cursor > lastCursor;
						}
					})
					.then(next, next);
				function next() {
					let interval = 1000;
					if (isActive) {
						setTimeout(f, interval);
					}
				}
			};
			f();
			function deactive() {
				isActive = false;
			}
			return deactive;
		});
	}

	getTimeline(options: {sinceCursor?: number, maxCursor?: number, count?: number} = {}) {
		return this.token.callApiWithHeaders<any[]>('status/timeline', {
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
		return this.token.callApiWithHeaders<IUser>('users/show', {
			method: 'GET',
			form: {
				'user-id': id
			}
		});
	}

	showByScreenName(screenName: string) {
		return this.token.callApiWithHeaders<IUser>('users/show', {
			method: 'GET',
			form: {
				'screen-name': screenName
			}
		});
	}

	follow(id: string) {
		return this.token.callApiWithHeaders<IUser>('users/follow', {
			method: 'POST',
			form: {
				'user-id': id
			}
		});
	}

	unfollow(id: string) {
		return this.token.callApiWithHeaders<IUser>('users/unfollow', {
			method: 'DELETE',
			form: {
				'user-id': id
			}
		});
	}
}

interface IUser {
	bannerImageUrl: string;
	bio: string;
	color: string;
	comment: string;
	createdAt: string;
	followersCount: number;
	followingsCount: number;
	iconImageUrl: string;
	id: string;
	isDisplayNotFollowUserMention: boolean;
	isPlus: boolean;
	isSuspended: boolean;
	isVerified: boolean;
	lang: string;
	links: string[];
	location: string;
	mobileHeaderDesignId: string;
	name: string;
	screenName: string;
	screenNameLower: string;
	statusFavoritesCount: number;
	statusesCount: number;
	tags: string[];
	url: string;
	wallpaperImageUrl: string;
}
