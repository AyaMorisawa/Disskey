import * as React from 'react';
import { SAuth, Token } from '../models/misskey';
const { RaisedButton, TextField }  = require('material-ui');

export interface IAuthFormProps {
	appKey: string;
	onGetToken: (token: Token) => void;
}

export interface IAuthFormState {
	pincode?: string;
	session?: SAuth.Session;
}

export default class AuthForm extends React.Component<IAuthFormProps, IAuthFormState> {
	constructor(props: IAuthFormProps) {
		super(props);
		this.state = {
			pincode: ''
		};
	}

	componentDidMount() {
		SAuth.Session.create(this.props.appKey).then(session => {
			this.setState({session});
			session.openAuthorizePage();
		});
	}

	onChangePincode(e: any) {
		this.setState({pincode: e.target.value});
	}

	onSubmitPincode() {
		const session = this.state.session;
		if (session !== void 0) {
			Token.create(session, this.state.pincode)
				.then(this.props.onGetToken);
		}
	};

	render() {
		return (
			<div style={{margin: '0 32px'} as any}>
				<TextField
					floatingLabelText='Enter the pincode'
					value={this.state.pincode}
					onChange={this.onChangePincode.bind(this)}
					style={{width: '100%'}}
				/>
				<RaisedButton
					onClick={this.onSubmitPincode.bind(this)}
					linkButton={true}
					label='Submit'
					style={{float: 'right'}}
				/>
			</div>
		);
	}
}
