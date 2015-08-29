import * as React from 'react';
var { div } = React.DOM;

function fixedContainer(...element: React.ReactElement<any>[]): React.ReactElement<any> {
	return div({
		style: {
			position: 'absolute',
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		}
	}, ...element);
}

export default fixedContainer;
