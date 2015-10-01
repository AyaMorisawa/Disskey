import * as path from 'path';
import * as file from './file';
import * as Kefir from 'kefir';

export interface IConfig {
	appKey?: string;
	userKey?: string;
	apiBaseUrl?: string;
}

export const appConfig: IConfig = {
	appKey: 'hmsk.HXLcVOeFfHhKPwZvdKBCgpyyTvtqrDAw',
	apiBaseUrl: 'http://api.misskey.xyz'
};

const userConfigDirPath = path.join((process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME, '.disskey');
const userConfigFilePath = path.join(userConfigDirPath, 'config.json');

function loadUserConfig(): Promise<IConfig> {
	'use strict';
	return file.exists(userConfigFilePath).then(exist => {
		if (exist) {
			return file.readJson<IConfig>(userConfigFilePath);
		} else {
			saveUserConfig(appConfig);
			return Promise.resolve({});
		}
	});
}

function saveUserConfig(userConfig: IConfig): void {
	'use strict';
	file.outputJson(userConfigFilePath, userConfig);
}

export function updateUserConfig(newUserConfig: IConfig): void {
	'use strict';
	loadUserConfig().then(userConfig => {
		saveUserConfig(Object.assign(userConfig, newUserConfig));
	});
}

export function createConfigProperty(): Promise<Kefir.Property<IConfig, void>> {
	'use strict';
	return loadUserConfig().then(initialUserConfig => {
		return Kefir.stream<IConfig, void>(emitter => {
			file.watch(userConfigFilePath).onValue(() => {
				loadUserConfig().then(currentUserConfig => {
					emitter.emit(currentUserConfig);
				});
			});
		})
		.toProperty(() => initialUserConfig)
		.map(userConfig => Object.assign(appConfig, userConfig));
	});
}
