import * as React from 'react';
import { Token } from '../misskey';
import config from '../config';
import AuthForm from './AuthForm';

var { div } = React.DOM;

interface IAppState {
	token?: Token;
	existUserKey?: boolean;
}

class App extends React.Component<{}, IAppState> {
	state: IAppState = {
		existUserKey: false
	};

	onGetToken(token: Token) {
		this.setState({
			token, existUserKey: true
		});
		console.log(token.userKey); // debug
		(<any>window).token = token; // debug
	}

	render() {
		return this.state.existUserKey
			? div({}, `Your user-key: ${this.state.token.userKey}`)
			: React.createElement(AuthForm, {
				appKey: config.sauthAppKey,
				onGetToken: this.onGetToken.bind(this)
			});
	}
}

React.render(React.createElement(App), document.getElementById('container'));
