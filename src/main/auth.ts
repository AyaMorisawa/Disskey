import * as React from 'react';

var { div, input, button } = React.DOM;

export interface IAuthProps {
	pincode?: string;
	onChangePincode?: React.FormEventHandler;
	onSubmitPincode?: React.MouseEventHandler;
}

exports = module.exports;

export default class Auth extends React.Component<IAuthProps, {}> {
	constructor(props: IAuthProps) {
		super(props);
	}

	render() {
		return div({},
			div({}, 'Enter the pincode.'),
			input({
				type: 'text',
				value: this.props.pincode,
				onChange: this.props.onChangePincode
			}),
			button({
				onClick: this.props.onSubmitPincode
			}, 'Submit')
		);
	}
}
