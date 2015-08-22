import * as React from 'react';
import config from '../config';
import { SAuth, Token } from '../misskey';
import Auth from './auth';

var { div } = React.DOM;

interface IAppState {
	userKey?: string;
	pincode?: string;
	session?: SAuth.Session;
	existUserKey?: boolean;
}

class App extends React.Component<{}, IAppState> {
	userKey: string;
	pincode: string;
	session: SAuth.Session;

	state: IAppState = {
		userKey: null,
		pincode: '',
		session: null,
		existUserKey: false
	};

	componentDidMount() {
		SAuth.Session.create(config.sauthAppKey).then(session => {
			this.setState({session});
			session.openAuthorizePage();
		});
	}

	changePincode(e: any) {
		this.setState({pincode: e.target.value});
	}

	submitPincode() {
		var session = this.state.session;
		if (session != null) {
			Token.create(session, this.state.pincode).then(token => {
				this.setState({
					userKey: token.userKey,
					existUserKey: true
				});
				console.log(token.userKey); // debug
				(<any>window).token = token; // debug
			});
		}
	}

	render() {
		return this.state.existUserKey
			? div({}, `Your user-key: ${this.state.userKey}`)
			: React.createElement(Auth, {
				onSubmitPincode: <React.FormEventHandler>this.submitPincode.bind(this),
				onChangePincode: <React.MouseEventHandler>this.changePincode.bind(this)
			});
	}
}

React.render(React.createElement(App), document.getElementById('container'));
