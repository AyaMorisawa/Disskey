import * as React from 'react';
import config from '../config';
import misskey from '../misskey';

misskey.sauth.getSessionKey(config.sauthAppKey).then(({ authenticationSessionKey: sessionKey }) => {
	console.log(sessionKey);
});

var App = React.createClass({
	render: function() {
		return React.DOM.div({}, 'Disskey is a Misskey client for desktop');
	}
});

React.render(React.createElement(App), document.getElementById('container'));
