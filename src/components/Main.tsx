import * as React from 'react';
import { Token } from '../models/misskey';
import AuthForm, { IAuthFormProps } from './AuthForm';
import PostFrom from './PostForm';
import { IConfig, appConfig, loadUserConfig, saveUserConfig } from '../models/config';
import { Match } from 'satch';
import FixedContainer from './FixedContainer';
let remote = require('remote');
let mui = require('material-ui');
let ThemeManager = new mui.Styles.ThemeManager();
let { AppBar, IconButton } = mui;
let NavigationClose = require('material-ui/lib/svg-icons/navigation/close')

interface IAppState {
	token?: Token;
	ready?: boolean;
	existToken?: boolean;
	config?: IConfig;
}

class App extends React.Component<{}, IAppState> {
	constructor(props?: {}, context?: any) {
		super(props, context);
		this.state = {
			ready: false,
			existToken: false
		};
		(window as any).app = this; // debug
	}

	static childContextTypes: React.ValidationMap<any> = {
		muiTheme: React.PropTypes.object
	};

	getChildContext() {
		return {
			muiTheme: ThemeManager.getCurrentTheme()
		};
	}

	componentDidMount() {
		loadUserConfig().then(userConfig => {
			let mergedConfig: IConfig = Object.assign(appConfig, userConfig);
			let existUserKey = mergedConfig.userKey !== void 0;
			if (existUserKey) {
				this.setState({
					ready: true,
					token: new Token(mergedConfig.appKey, mergedConfig.userKey),
					existToken: true,
					config: mergedConfig
				});
			} else {
				this.setState({
					ready: true,
					config: mergedConfig
				});
			}
			remote.getCurrentWindow().show();
		});
	}

	onGetToken(token: Token) {
		this.setState({
			token,
			existToken: true
		});
		loadUserConfig().then(userConfig => {
			userConfig.userKey = token.userKey;
			saveUserConfig(userConfig);
		});
	}

	updateStatus(text: string) {
		this.state.token.status.update(text);
	}

	onClickCloseButton() {
		setTimeout(() => remote.getCurrentWindow().close(), 256);
	}

	render() {
		return (
			<FixedContainer>
				<AppBar
					title='Disskey'
					showMenuIconButton={false}
					iconElementRight={
						<IconButton style={{WebkitAppRegion: 'no-drag'}} onClick={this.onClickCloseButton}>
							<NavigationClose />
						</IconButton>
					}
					style={{WebkitAppRegion: 'drag'}} />
				{
					new Match<any, React.DOMElement<React.HTMLAttributes> | React.ReactElement<IAuthFormProps>>(null)
						.when(() => !this.state.ready, () => <div></div>)
						.when(() => !this.state.existToken, () =>
							<AuthForm
								appKey={this.state.config.appKey}
								onGetToken={this.onGetToken.bind(this)} />
						)
						.default(() =>
							<PostFrom onSubmit={this.updateStatus.bind(this)} />
						)
				}
			</FixedContainer>
		);
	}
}

React.render(<App />, document.getElementById('container'));
