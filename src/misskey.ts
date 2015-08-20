import * as request from 'request-promise';

function getSessionKey(appKey: string): Promise<{ authenticationSessionKey: string }> {
	return request({
		url: 'https://api.misskey.xyz/sauth/get-authentication-session-key',
		method: 'GET',
		headers: {
			'sauth-app-key': appKey
		},
		json: true
	});
}

export default {
	sauth: {
		getSessionKey: getSessionKey
	}
}
