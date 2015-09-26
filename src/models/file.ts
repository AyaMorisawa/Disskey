import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

export function writeJsonFile<T>(filePath: string, data: T): void {
	'use strict';
	writeTextFile(filePath, JSON.stringify(data, null, '\t'));
}

export function writeTextFile(filePath: string, data: string): void {
	'use strict';
	mkdirp(path.dirname(filePath), () => fs.writeFile(filePath, data));
}

export function existFile(filePath: string) {
	'use strict';
	return new Promise<boolean>((resolve, reject) => {
		fs.stat(filePath, (err, stat) => {
			if (err) {
				if (err.code === 'ENOENT') {
					resolve(false);
				} else {
					reject(err);
				}
			} else {
				resolve(true);
			}
		});
	});
}

export function readJsonFile<T>(filePath: string): Promise<T> {
	'use strict';
	return readTextFile(filePath).then(data => JSON.parse(data));
}

export function readTextFile(filePath: string): Promise<string> {
	'use strict';
	return new Promise<string>((resolve, reject) => {
		fs.readFile(filePath, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data.toString());
			}
		});
	});
}
