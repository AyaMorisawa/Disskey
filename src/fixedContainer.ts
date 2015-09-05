import * as React from 'react';
var { div } = React.DOM;
var objectAssign: (target: any, ...sources: any[]) => any = require('object-assign');

function fixedContainer(style: any, ...element: React.ReactElement<any>[]) {
	return div({
		style: objectAssign({
			position: 'absolute',
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		}, style)
	}, ...element);
}

export default fixedContainer;
