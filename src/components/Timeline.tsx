import * as React from 'react';
import Post, { IPostProps } from './Post';

export interface ITimelineProps {
	style?: any;
	posts: IPostProps[];
}

export default class Timeline extends React.Component<ITimelineProps, {}> {
	render() {
		return (
			<div style={Object.assign({
				display: 'flex',
				flexDirection: 'column-reverse'
			}, this.props.style)}>{
				this.props.posts.map(post =>
					<Post style={{margin: '16px 0'}} key={post.id} {...post} />
				)
			}</div>
		);
	}
}
