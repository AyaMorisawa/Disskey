import * as React from 'react';
import config from '../config';
import { sauth } from '../misskey';

sauth.getSessionKey(config.sauthAppKey).then(sessionKey => {
	// sauth.openAuthorizePage(sessionKey);
	console.log(sessionKey);
});
/*
sauth.getUserKey(config.sauthAppKey, sessionKey, pincode).then(data => {
	console.log(data);
});
*/

var App = React.createClass({
	render: function() {
		return React.DOM.div({}, 'Disskey is a Misskey client for desktop');
	}
});

React.render(React.createElement(App), document.getElementById('container'));
