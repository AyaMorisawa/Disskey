import * as React from 'react';
import { Token } from '../models/misskey';
import AuthForm, { IAuthFormProps } from './AuthForm';
import PostFrom from './PostForm';
import Timeline from './Timeline';
import { IConfig, appConfig, loadUserConfig, saveUserConfig } from '../models/config';
import { Match } from 'satch';
import FixedContainer from './FixedContainer';
import { IPostProps } from './Post';
const remote = require('remote');
const mui = require('material-ui');
const ThemeManager = new mui.Styles.ThemeManager();
const { AppBar, IconButton } = mui;
const NavigationClose = require('material-ui/lib/svg-icons/navigation/close');

interface IAppState {
	token?: Token;
	ready?: boolean;
	existToken?: boolean;
	config?: IConfig;
	timeline?: IPostProps[];
}

export default class App extends React.Component<{}, IAppState> {
	constructor(props?: {}, context?: any) {
		super(props, context);
		this.state = {
			ready: false,
			existToken: false,
			timeline: []
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
			const mergedConfig: IConfig = Object.assign(appConfig, userConfig);
			const existUserKey = mergedConfig.userKey !== void 0;
			if (existUserKey) {
				this.setState({
					ready: true,
					token: new Token(mergedConfig.appKey, mergedConfig.userKey),
					existToken: true,
					config: mergedConfig
				});
				this.startTimeline();
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
		this.startTimeline();
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

	startTimeline() {
		const token = this.state.token;
		token.status.getTimeline()
			.then(x => x.reverse())
			.then<IPostProps[]>(posts => posts.map(post => {
				return {
					id: post.id,
					text: post.text,
					userId: post.userId,
					userName: post.user.name,
					userScreenName: post.user.screenName,
					createdAt: new Date(post.createdAt)
				};
			}))
			.then(posts => this.setState({
				timeline: this.state.timeline.concat(posts)
			}));

		token.status.createStream()
			.filter(x => x.event === 'status-update')
			.map(x => x.data)
			.withHandler<IPostProps, {}>((emitter, event) => {
				if (event.type === 'value') {
					const post = event.value;
					token.users.showById(post.userId)
						.then(user => {
							return {
								id: post.id,
								text: post.text,
								userId: post.userId,
								userName: user.name,
								userScreenName: user.screenName,
								createdAt: new Date(post.createdAt)
							};
						})
						.then(emitter.emit);
				}
			})
			.onValue(post => this.setState({
					timeline: this.state.timeline.concat([post])
			}));
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
				<FixedContainer style={{top: '64px', padding: '0 32px', overflowY: 'scroll'} as any}>{
					new Match<any, React.DOMElement<React.HTMLAttributes> | React.ReactElement<IAuthFormProps>>(null)
						.when(() => !this.state.ready, () => <div></div>)
						.when(() => !this.state.existToken, () =>
							<AuthForm
								appKey={this.state.config.appKey}
								onGetToken={this.onGetToken.bind(this)} />
						)
						.default(() =>
							<div>
								<PostFrom onSubmit={this.updateStatus.bind(this)} />
								<Timeline style={{padding: '0 0'} as any} posts={this.state.timeline}/>
							</div>
						)
				}</FixedContainer>
			</FixedContainer>
		);
	}
}
