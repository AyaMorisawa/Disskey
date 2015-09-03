import * as React from 'react';
import { Token } from '../misskey';
import config from '../config';
import AuthForm, { IAuthFormProps } from './AuthForm';

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
		var existUserKey = true; // TODO: Check token
		if (existUserKey) {
			// TODO: Set token
		}
		this.setState({
			checkingToken: false,
			existToken: existUserKey
		});
	}

	onGetToken(token: Token) {
		this.setState({
			token, existToken: true
		});
		console.log(token.userKey); // debug
		(<any>window).token = token; // debug
	}

	render(): React.DOMElement<React.HTMLAttributes> | React.ReactElement<IAuthFormProps> {
		switch (true) {
			case this.state.checkingToken:
				return div({}, '[splash window]');
			case !this.state.existToken:
				return React.createElement<IAuthFormProps>(AuthForm, {
					appKey: config.sauthAppKey,
					onGetToken: this.onGetToken.bind(this)
				});
			default:
				return div({}, `Your user-key: ${this.state.token.userKey}`);
		}
	}
}

React.render(React.createElement(App), document.getElementById('container'));
