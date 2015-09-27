import * as React from 'react';
import padString from '../utils/padString';

export interface IPostProps {
	key?: string;
	style?: any;
	id: string;
	text: string;
	imageUrls: string[];
	userId: string;
	userName: string;
	userScreenName: string;
	createdAt: Date;
}

export default class Post extends React.Component<IPostProps, {}> {
	render() {
		const userIconUrl = `http://img.misskey.xyz/contents/user-contents/user/${this.props.userId}/icon/${this.props.userId}.jpg`;
		return (
			<div style={this.props.style}>
				<div style={{display: 'flex'} as any}>
					<img style={{flexBasis: '64px'} as any} width="64" height="64" src={userIconUrl} />
					<div style={{padding: '0 16px', flex: 1} as any}>
						<div style={{display: 'flex', lineHeight: '24px'} as any}>
							<div style={{fontWeight: 'bold'} as any}>{this.props.userScreenName}</div>
							<div style={{margin: '0 8px', color: 'gray'} as any}>{this.props.userName}</div>
						</div>
						<div style={{margin: '4px 0', whiteSpace: 'pre', wordWrap: 'break-word'} as any}>{this.props.text}</div>
						<div>{
							this.props.imageUrls.map(imageUrl => (
								<img style={{maxHeight: '128px'} as any} src={imageUrl} />
							))
						}</div>
					</div>
				</div>
				<div style={{padding: '0 16px 0 80px', color: 'gray'} as any}>{
					(() => {
						const hours = padString(this.props.createdAt.getHours().toString(), 2, '0');
						const minutes = padString(this.props.createdAt.getMinutes().toString(), 2, '0');
						const seconds = padString(this.props.createdAt.getSeconds().toString(), 2, '0');
						return `${hours}:${minutes}:${seconds}`;
					})()
				}</div>
			</div>
		);
	}
}
