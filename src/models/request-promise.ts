import * as request from 'request';

function requestPromise(options: request.Options) {
	'use strict';
	return new Promise<string>((resolve, reject) => {
		request(options, (error, response, body) => {
			if (error) {
				reject(error);
			} else {
				resolve(body);
			}
		});
	});
}

export default requestPromise;
