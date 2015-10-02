import * as React from 'react';
import { SAuth, Token } from '../models/misskey';
import AuthForm, { IAuthFormProps } from './AuthForm';
import PostFrom from './PostForm';
import Timeline from './Timeline';
import { IConfig, updateUserConfig, createConfigProperty } from '../models/config';
import { Match } from 'satch';
import FixedContainer from './FixedContainer';
import { IPostProps } from './Post';
import { openExternal } from 'shell';
const remote = require('remote');
const { AppBar, IconButton, Styles } = require('material-ui');
const { ThemeManager, ThemeDecorator } = Styles;
const NavigationClose = require('material-ui/lib/svg-icons/navigation/close');

interface IAppState {
	token?: Token;
	ready?: boolean;
	existToken?: boolean;
	config?: IConfig;
	timeline?: IPostProps[];
	session?: SAuth.Session;
}

@ThemeDecorator(ThemeManager.getMuiTheme(Styles.LightRawTheme))
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

	componentDidMount() {
		createConfigProperty().then(configProperty => {
			configProperty.onValue(config => {
				const existUserKey = config.userKey !== void 0;
				if (existUserKey) {
					this.setState({
						ready: true,
						token: new Token(config.appKey, config.userKey),
						existToken: true,
						config: config
					});
				} else {
					this.setState({
						ready: true,
						config: config
					});
					SAuth.Session.create(config.appKey).then(session => {
						this.setState({session});
						openExternal(session.authorizePageUrl);
					});
				}
			});
		});
	}

	componentDidUpdate(prevProps: {}, prevState: IAppState) {
		if (!prevState.ready && this.state.ready) {
			remote.getCurrentWindow().show();
		}
		if (!prevState.existToken && this.state.existToken) {
			this.startTimeline();
		}
	}

	onSubmitPincode(pincode: string) {
		const session = this.state.session;
		if (session !== void 0) {
			Token.create(session, pincode).then(this.onGetToken);
		}
	}

	onGetToken(token: Token) {
		this.setState({
			token,
			existToken: true
		});
		updateUserConfig({ userKey: token.userKey });
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
					imageUrls: post.imageUrls,
					userId: post.userId,
					userName: post.user.name,
					userScreenName: post.user.screenName,
					createdAt: new Date(post.createdAt)
				};
			}))
			.then(posts => {
				this.setState({
					timeline: [...this.state.timeline, ...posts]
				});
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
										imageUrls: post.imageUrls,
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
							timeline: [...this.state.timeline, post]
					}));
			});
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
							<AuthForm onSubmit={this.onSubmitPincode.bind(this)} />
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
