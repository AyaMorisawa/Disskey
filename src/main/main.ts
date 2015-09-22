import * as React from 'react';
import { Token } from '../model/misskey';
import AuthForm, { IAuthFormProps } from './AuthForm';
import PostFrom, { IPostFormProps } from './PostForm';
import { IConfig, appConfig, loadUserConfig, saveUserConfig } from '../model/config';
import { Match } from 'satch';
import fixedContainer from '../fixedContainer';
let objectAssign: (target: any, ...sources: any[]) => any = require('object-assign');

let { div } = React.DOM;

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
		(<any>window).app = this; // debug
	}

	componentDidMount() {
		loadUserConfig().then(userConfig => {
			let mergedConfig: IConfig = objectAssign(appConfig, userConfig);
			let existUserKey = mergedConfig.userKey !== void 0;
			setTimeout(() => {
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
			}, 1000);
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

	render() {
		return new Match<any, React.DOMElement<React.HTMLAttributes> | React.ReactElement<IAuthFormProps>>(null)
			.when(() => !this.state.ready, () => fixedContainer({}, div(<any>{
					style: {
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						fontSize: '10em',
						color: '#979797'
					}
				}, 'Loading...')))
			.when(() => !this.state.existToken, () => React.createElement<IAuthFormProps>(AuthForm, {
				appKey: this.state.config.appKey,
				onGetToken: this.onGetToken.bind(this)
			}))
			.default(() => fixedContainer({},
				div({}, React.createElement<IPostFormProps>(PostFrom, {
					onSubmit: this.updateStatus.bind(this)
				}))
			));
	}
}

React.render(React.createElement(App), document.getElementById('container'));
