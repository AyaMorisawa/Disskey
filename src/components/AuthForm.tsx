import * as React from 'react';
const { RaisedButton, TextField }  = require('material-ui');

export interface IAuthFormProps {
	onSubmit: (pincode: string) => void;
}

export interface IAuthFormState {
	pincode?: string;
}

export default class AuthForm extends React.Component<IAuthFormProps, IAuthFormState> {
	constructor(props: IAuthFormProps) {
		super(props);
		this.state = {
			pincode: ''
		};
	}

	onChangePincode(e: any) {
		this.setState({pincode: e.target.value});
	}

	onSubmitPincode() {
		this.props.onSubmit(this.state.pincode);
	};

	render() {
		return (
			<div>
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
