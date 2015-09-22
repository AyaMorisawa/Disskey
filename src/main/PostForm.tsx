import * as React from 'react';
import fixedContainer from '../fixedContainer';
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var { RaisedButton, TextField } = mui;

export interface IPostFormProps {
	onSubmit: (text: string) => void;
}

export interface IPostFormState {
	text?: string;
}

exports = module.exports;

export default class PostForm extends React.Component<IPostFormProps, IPostFormState> {
	constructor(props: IPostFormProps) {
		super(props);
		this.state = {
			text: ''
		};
	}

	static childContextTypes: React.ValidationMap<any> = {
		muiTheme: React.PropTypes.object
	};

	getChildContext() {
		return {
			muiTheme: ThemeManager.getCurrentTheme()
		};
	}

	onChange(e: any) {
		this.setState({text: e.target.value});
	}

	onSubmit() {
		var text = this.state.text;
		this.setState({text: ''});
		this.props.onSubmit(text);
	}

	render() {
		return fixedContainer({
			margin: 32
		}, <TextField
			floatingLabelText="What's happening?"
			value={this.state.text}
			multiLine={true}
			onChange={this.onChange.bind(this)}
			style={{width: '100%'}}
		/>, <RaisedButton
			onClick={this.onSubmit.bind(this)}
			linkButton={true}
			label='Submit'
			style={{float: 'right'}}
		/>);
	}
}
