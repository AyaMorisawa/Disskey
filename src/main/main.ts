import * as React from "react"

var Hoge = React.createClass({
	render: function() {
		return React.DOM.div({}, 'Disskey is a Misskey client for desktop');
	}
})

React.render(React.createElement(Hoge), document.getElementById('container'))