import * as React from 'react';
import config from '../config';
import { sauth } from '../misskey';

var { div, input, button } = React.DOM;

interface IAppState {
	userKey?: string;
	inputPincode?: string;
	session: string;
}

var App = React.createClass({
	componentDidMount() {
		var existUserKey = false; // temporary
		if (existUserKey) {
		} else {
			sauth.createSession(config.sauthAppKey).then(session => {
				this.setState({session});
				session.openAuthorizePage();
			});
		}
	},
	getInitialState(): IAppState {
		return {
			userKey: null,
			inputPincode: '',
			session: null
		};
	},
	changeInputPincode(e: any) {
		this.setState({inputPincode: e.target.value});
	},
	submitPincode() {
		var pincode: string = this.state.inputPincode;
		var session: sauth.Session = this.state.session;
		session.getUserKey(pincode).then(({userKey, user}) => {
			console.log(userKey);
			console.log(user);
		});
	},
	render() {
		return div({},
			div({}, 'Enter the pincode.'),
			input({
				type: 'text',
				input: this.state.inputPinCode,
				onChange: this.changeInputPincode
			}),
			button({
				onClick: this.submitPincode
			}, 'Submit')
		);
	}
});

React.render(React.createElement(App), document.getElementById('container'));
