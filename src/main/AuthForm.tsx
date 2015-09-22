import * as React from 'react';
import { SAuth, Token } from '../model/misskey';
import FixedContainer from './FixedContainer';
let mui = require('material-ui');
let { RaisedButton, TextField } = mui;

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
		let session = this.state.session;
		if (session != null) {
			Token.create(session, this.state.pincode)
				.then(this.props.onGetToken);
		}
	};

	render() {
		return (
			<FixedContainer style={{margin: 32}}>
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
			</FixedContainer>
		);
	}
}
