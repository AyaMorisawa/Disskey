import * as React from 'react';
const mui = require('material-ui');
const { RaisedButton, TextField } = mui;

export interface IPostFormProps {
	onSubmit: (text: string) => void;
}

export interface IPostFormState {
	text?: string;
}

export default class PostForm extends React.Component<IPostFormProps, IPostFormState> {
	constructor(props: IPostFormProps) {
		super(props);
		this.state = {
			text: ''
		};
	}

	onChange(e: any) {
		this.setState({text: e.target.value});
	}

	onKeyDownText(e: KeyboardEvent) {
		if (e.ctrlKey && e.keyCode === 13) {
			this.onSubmit();
		}
	}

	onSubmit() {
		const text = this.state.text;
		this.setState({text: ''});
		this.props.onSubmit(text);
	}

	render() {
		return (
			<div style={{margin: '0 32px'} as any}>
				<TextField
					floatingLabelText="What's happening?"
					value={this.state.text}
					multiLine={true}
					onChange={this.onChange.bind(this)}
					onKeyDown={this.onKeyDownText.bind(this)}
					style={{width: '100%'}}
				/>
				<div style={{float: 'right', display: 'flex', flexDirection: 'row'} as any}>
					<div style={{
						color: 300 - this.state.text.length >= 0 ? 'black' : 'red',
						lineHeight: '38px',
						marginRight: 12
					} as any}>{300 - this.state.text.length}</div>
					<RaisedButton
						onClick={this.onSubmit.bind(this)}
						linkButton={true}
						label='Submit'
					/>
				</div>
			</div>
		);
	}
}
