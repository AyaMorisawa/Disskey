import * as React from 'react';
import { Token } from '../misskey';
import appConfig from '../config/app';
import * as userConfigProvider from '../config/user';
import AuthForm, { IAuthFormProps } from './AuthForm';
import { Match } from 'satch';

var { div } = React.DOM;

interface IAppState {
	token?: Token;
	checkingToken?: boolean;
	existToken?: boolean;
}

class App extends React.Component<{}, IAppState> {
	constructor(props?: {}, context?: any) {
		super(props, context);
		this.state = {
			checkingToken: true,
			existToken: false
		};
	}

	componentDidMount() {
		userConfigProvider.read().then(userConfig => {
			var mergedConfig = userConfig; // TODO: merge(config, userConfig);
			var existUserKey = mergedConfig.userKey !== void 0;
			if (existUserKey) {
				this.setState({
					checkingToken: false,
					token: new Token(appConfig.appKey, mergedConfig.userKey), // TODO: mergedConfig.appKey
					existToken: true
				});
			} else {
				this.setState({
					checkingToken: false
				});
			}
		});
	}

	onGetToken(token: Token) {
		this.setState({
			token, existToken: true
		});
		userConfigProvider.read().then(userConfig => {
			userConfig.userKey = token.userKey;
			userConfigProvider.write(userConfig);
		});
		(<any>window).token = token; // debug
	}

	render() {
		return new Match<any, React.DOMElement<React.HTMLAttributes> | React.ReactElement<IAuthFormProps>>(null)
			.when(() => this.state.checkingToken, () => div({}, '[splash window]'))
			.when(() => !this.state.existToken, () => React.createElement<IAuthFormProps>(AuthForm, {
				appKey: appConfig.appKey, // TODO: merge
				onGetToken: this.onGetToken.bind(this)
			}))
			.default(() => div({}, `Your user-key: ${this.state.token.userKey}`));
	}
}

React.render(React.createElement(App), document.getElementById('container'));
