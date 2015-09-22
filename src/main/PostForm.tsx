import * as React from 'react';
let mui = require('material-ui');
let { RaisedButton, TextField } = mui;

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
		let text = this.state.text;
		this.setState({text: ''});
		this.props.onSubmit(text);
	}

	render() {
		return (
			<div style={{margin: 32} as any}>
				<TextField
					floatingLabelText="What's happening?"
					value={this.state.text}
					multiLine={true}
					onChange={this.onChange.bind(this)}
					onKeyDown={this.onKeyDownText.bind(this)}
					style={{width: '100%'}}
				/>
				<RaisedButton
					onClick={this.onSubmit.bind(this)}
					linkButton={true}
					label='Submit'
					style={{float: 'right'}}
				/>
			</div>
		);
	}
}
