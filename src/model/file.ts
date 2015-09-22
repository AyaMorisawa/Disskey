import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

export function writeJsonFile<T>(filePath: string, data: T): void {
	writeTextFile(filePath, JSON.stringify(data, null, '\t'));
}

export function writeTextFile(filePath: string, data: string): void {
	let dirPath = path.dirname(filePath);
	mkdirp(dirPath, () => fs.writeFile(filePath, data));
}

export function existFile(filePath: string) {
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
	return readTextFile(filePath).then(data => JSON.parse(data));
}

export function readTextFile(filePath: string): Promise<string> {
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