import * as request from 'request';

function requestPromise(options: request.Options) {
	return new Promise<string>((resolve, reject) => {
		request(options, (error, response, body) => {
			error ? reject(error) : resolve(body);
		});
	});
}

export default requestPromise;