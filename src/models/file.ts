import * as fs from 'fs-extra';

export function outputJson<T>(file: string, object: T) {
	'use strict';
	return new Promise<void>((resolve, reject) => {
		fs.outputJson(file, object, err => {
			if (err) {
				reject();
			} else {
				resolve();
			}
		});
	});
}

export function exists(path: string) {
	'use strict';
	return new Promise<boolean>((resolve, reject) => {
		fs.exists(path, exists => {
			resolve(exists);
		});
	});
}

export function readJson<T>(file: string) {
	'use strict';
	return new Promise<T>((resolve, reject) => {
		fs.readJson(file, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}
