import * as React from 'react';
import config from '../config';
import { SAuth } from '../misskey';
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
			this.state.session.getUserKey(this.state.pincode).then(({userKey, user}) => {
				this.setState({userKey, existUserKey: true});
				console.log(userKey);
				console.log(user);
			});
		}
	}

	render() {
		return this.state.existUserKey ? React.createElement(Auth, {
			onSubmitPincode: <React.FormEventHandler>this.submitPincode.bind(this),
			onChangePincode: <React.MouseEventHandler>this.changePincode.bind(this)
		}) : div({}, `Your user-key: ${this.state.userKey}`);
	}
}

React.render(React.createElement(App), document.getElementById('container'));
