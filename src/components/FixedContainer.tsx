import * as React from 'react';

export default class FixedContainer extends React.Component<{children?: JSX.Element, style?: any}, {}> {
	render() {
		return (
			<div style={Object.assign({
				position: 'absolute',
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}, this.props.style)}>{this.props.children}</div>
		);
	}
}
