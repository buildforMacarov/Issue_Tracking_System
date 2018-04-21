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
		const { loggedIn } = this.state;
		const page = loggedIn ?
			<IssuePage
				userType='admin'
				AUTHTOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYSQxMiQyc2dPTVhXTmU4Mjd1QUxZMHdHMlh1Y3BEODk4L3FHWUhjNWxIZ0tldUx0L0FlN2diRndhYSIsImlhdCI6MTUyMzI2NDIxN30.kn34Zc76XRrBH8JxGIYONljP8-YMaaCyF9RU00-1EDE'
			/>
			: <LoginPage />
		return page;
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);