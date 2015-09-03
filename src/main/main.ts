import * as React from 'react';
import { Token } from '../misskey';
import config, { readUserConfig, writeUserConfig } from '../config';
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
		readUserConfig().then(userConfig => {
			var mergedConfig = userConfig; // TODO: merge(config, userConfig);
			var existUserKey = mergedConfig.userKey !== void 0;
			if (existUserKey) {
				this.setState({
					checkingToken: false,
					token: new Token(config.appKey, mergedConfig.userKey), // TODO: mergedConfig.appKey
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
		readUserConfig().then(userConfig => {
			userConfig.userKey = token.userKey;
			writeUserConfig(userConfig);
		});
		(<any>window).token = token; // debug
	}

	render() {
		return new Match<any, React.DOMElement<React.HTMLAttributes> | React.ReactElement<IAuthFormProps>>(null)
			.when(() => this.state.checkingToken, () => div({}, '[splash window]'))
			.when(() => !this.state.existToken, () => React.createElement<IAuthFormProps>(AuthForm, {
				appKey: config.appKey,
				onGetToken: this.onGetToken.bind(this)
			}))
			.default(() => div({}, `Your user-key: ${this.state.token.userKey}`));
	}
}

React.render(React.createElement(App), document.getElementById('container'));
