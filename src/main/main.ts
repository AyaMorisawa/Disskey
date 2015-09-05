import * as React from 'react';
import { Token } from '../misskey';
import IConfig from '../config/IConfig';
import appConfig from '../config/app';
import * as userConfigProvider from '../config/user';
import AuthForm, { IAuthFormProps } from './AuthForm';
import { Match } from 'satch';
var objectAssign: (target: any, ...sources: any[]) => any = require('object-assign');

var { div } = React.DOM;

interface IAppState {
	token?: Token;
	ready?: boolean;
	existToken?: boolean;
	config?: IConfig;
}

class App extends React.Component<{}, IAppState> {
	constructor(props?: {}, context?: any) {
		super(props, context);
		this.state = {
			ready: false,
			existToken: false
		};
		(<any>window).app = this; // debug
	}

	componentDidMount() {
		userConfigProvider.read().then(userConfig => {
			var mergedConfig: IConfig = objectAssign(appConfig, userConfig);
			var existUserKey = mergedConfig.userKey !== void 0;
			if (existUserKey) {
				this.setState({
					ready: true,
					token: new Token(mergedConfig.appKey, mergedConfig.userKey), // TODO: mergedConfig.appKey
					existToken: true,
					config: mergedConfig
				});
			} else {
				this.setState({
					ready: true,
					config: mergedConfig
				});
			}
		});
	}

	onGetToken(token: Token) {
		this.setState({
			token,
			existToken: true
		});
		userConfigProvider.read().then(userConfig => {
			userConfig.userKey = token.userKey;
			userConfigProvider.write(userConfig);
		});
	}

	render() {
		return new Match<any, React.DOMElement<React.HTMLAttributes> | React.ReactElement<IAuthFormProps>>(null)
			.when(() => !this.state.ready, () => div({}, '[splash window]'))
			.when(() => !this.state.existToken, () => React.createElement<IAuthFormProps>(AuthForm, {
				appKey: this.state.config.appKey, // TODO: merge
				onGetToken: this.onGetToken.bind(this)
			}))
			.default(() => div({}, `Your user-key: ${this.state.token.userKey}`));
	}
}

React.render(React.createElement(App), document.getElementById('container'));
