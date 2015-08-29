import * as React from 'react';
import { SAuth, Token } from '../misskey';
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var { RaisedButton } = mui;

var { div, input, button } = React.DOM;

export interface IAuthProps {
	appKey: string;
	onGetToken: (token: Token) => void;
}

export interface IAuthState {
	pincode?: string;
	session?: SAuth.Session;
}

exports = module.exports;

export default class Auth extends React.Component<IAuthProps, IAuthState> {
	constructor(props: IAuthProps) {
		super(props);
		this.state = {
			pincode: ''
		};
	}
	
	static childContextTypes: React.ValidationMap<any> = {
		muiTheme: React.PropTypes.object
	}

	getChildContext() {
		return {
			muiTheme: ThemeManager.getCurrentTheme()
		};
	}

	componentDidMount() {
		SAuth.Session.create(this.props.appKey).then(session => {
			this.setState({session});
			session.openAuthorizePage();
		});
	}
	
	onChangePincode = (e: any) => {
		this.setState({pincode: e.target.value});
	}
	
	onSubmitPincode = () => {
		var session = this.state.session;
		if (session != null) {
			Token.create(session, this.state.pincode)
				.then(this.props.onGetToken);
		}
	};

	render() {
		return div({},
			div({}, 'Enter the pincode.'),
			input({
				type: 'text',
				value: this.state.pincode,
				onChange: this.onChangePincode
			}),
			React.createElement(RaisedButton, {
				onClick: this.onSubmitPincode	,
				linkButton: true,
				label: 'Submit'
			})
		);
	}
}
