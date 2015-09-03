import * as path from 'path';
import * as fs from 'fs';
import * as Promise from 'bluebird';
import * as mkdirp from 'mkdirp';

export interface IConfig {
	appKey?: string;
	userKey?: string;
}

export var userConfigDirPath = path.join((process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME, '.disskey');

export var userConfigFilePath = path.join(userConfigDirPath, 'config.json');

export function existUserConfig() {
	return new Promise<boolean>((resolve, reject) => {
		fs.stat(userConfigFilePath, (err, stat) => {
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

export function readUserConfig() {
	return existUserConfig().then<IConfig>((exist: boolean) => {
		if (!exist) {
			writeUserConfig(config);
			return Promise.resolve({});
		}
		return new Promise<IConfig>((resolve, reject) => {
			fs.readFile(userConfigFilePath, (err, userConfigJson) => {
				if (err) {
					reject(err);
				} else {
					resolve(JSON.parse(userConfigJson.toString()));
				}
			});
		});
	});
}

export function writeUserConfig(config: IConfig): void {
	mkdirp(userConfigDirPath, () => fs.writeFile(userConfigFilePath, JSON.stringify(config)));
}

var config: IConfig = {
	appKey: 'hmsk.HXLcVOeFfHhKPwZvdKBCgpyyTvtqrDAw'
};

export default config;
