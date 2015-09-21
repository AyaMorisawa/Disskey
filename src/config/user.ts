import * as path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import IConfig from './IConfig';
import appConfig from './app';

export var dirPath = path.join((process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME, '.disskey');

export var filePath = path.join(dirPath, 'config.json');

export function existFile() {
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

export function read() {
	return existFile().then<IConfig>((exist: boolean) => {
		if (!exist) {
			write(appConfig);
			return Promise.resolve({});
		}
		return new Promise<IConfig>((resolve, reject) => {
			fs.readFile(filePath, (err, userConfigJson) => {
				if (err) {
					reject(err);
				} else {
					resolve(JSON.parse(userConfigJson.toString()));
				}
			});
		});
	});
}

export function write(config: IConfig): void {
	mkdirp(dirPath, () => fs.writeFile(filePath, JSON.stringify(config, null, '\t')));
}
