import * as React from 'react';

var App = React.createClass({
	render: function() {
		return React.DOM.div({}, 'Disskey is a Misskey client for desktop');
	}
});

React.render(React.createElement(App), document.getElementById('container'));
