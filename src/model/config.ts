import * as path from 'path';
import * as file from './file';

export interface IConfig {
	appKey?: string;
	userKey?: string;
}

export var appConfig: IConfig = {
	appKey: 'hmsk.HXLcVOeFfHhKPwZvdKBCgpyyTvtqrDAw'
};

var userConfigDirPath = path.join((process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME, '.disskey');
var userConfigFilePath = path.join(userConfigDirPath, 'config.json');

export function loadUserConfig(): Promise<IConfig> {
	return file.existFile(userConfigFilePath).then((exist: boolean) => {
		if (exist) {
			return file.readJsonFile<IConfig>(userConfigFilePath);
		} else {
			saveUserConfig(appConfig);
			return Promise.resolve({});
		}
	});
}

export function saveUserConfig(userConfig: IConfig): void {
	file.writeJsonFile(userConfigFilePath, userConfig);
}
