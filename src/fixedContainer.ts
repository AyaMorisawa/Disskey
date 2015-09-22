import * as React from 'react';
let { div } = React.DOM;

function fixedContainer(style: any, ...element: React.ReactElement<any>[]) {
	return div({
		style: Object.assign({
			position: 'absolute',
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		}, style)
	}, ...element);
}

export default fixedContainer;
