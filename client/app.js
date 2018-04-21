import React from 'react';
import ReactDOM from 'react-dom';

import { LoginPage } from './components/loginpage';
import { IssuePage } from './components/issuepage';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			authToken: null,
			userType: null
		};

		this.loginSuccess = this.loginSuccess.bind(this);
	}

	loginSuccess(login) {
		this.setState({
			loggedIn: true,
			authToken: login.token,
			userType: login.userType
		});
	}

	render() {
		const { loggedIn, authToken, userType } = this.state;
		const page = loggedIn ?
			<IssuePage userType={userType} AUTHTOKEN={authToken} /> :
			<LoginPage onLogin={this.loginSuccess} />
		return page;
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);