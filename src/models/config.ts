import * as path from 'path';
import * as file from './file';

export interface IConfig {
	appKey?: string;
	userKey?: string;
	apiBaseUrl?: string;
}

export let appConfig: IConfig = {
	appKey: 'hmsk.HXLcVOeFfHhKPwZvdKBCgpyyTvtqrDAw',
	apiBaseUrl: 'http://api.misskey.xyz'
};

let userConfigDirPath = path.join((process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME, '.disskey');
let userConfigFilePath = path.join(userConfigDirPath, 'config.json');

export function loadUserConfig(): Promise<IConfig> {
	'use strict';
	return file.existFile(userConfigFilePath).then(exist => {
		if (exist) {
			return file.readJsonFile<IConfig>(userConfigFilePath);
		} else {
			saveUserConfig(appConfig);
			return Promise.resolve({});
		}
	});
}

export function saveUserConfig(userConfig: IConfig): void {
	'use strict';
	file.writeJsonFile(userConfigFilePath, userConfig);
}
