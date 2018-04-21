import React from 'react';
import axios from 'axios';

export class LoginPage extends React.Component {
	constructor(props) {
		super(props);

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();

		const userType = document.querySelector('input[name=account-type]:checked').value;
		const email = document.getElementById('inputEmail').value;
		const password = document.getElementById('inputPassword').value;

		axios.post(`/${userType}s/login`, { email, password })
		.then(response => {
			this.props.onLogin({
				token: response.headers['x-auth'],
				userType: userType
			});
		}, error => {
			/* TODO - render login error */
			console.log('Oopsy!', error);
		});
	}

	render() {
		return (
			<div className="Login-page container">
		        <div className="row">
					<div className="col">
						<form onSubmit={this.handleSubmit}>
							<div className="form-group">
								<label>Email address</label>
								<input type="email" className="form-control" id="inputEmail" placeholder="Enter email" required autofocus />
							</div>
							<div className="form-group">
								<label>Password</label>
								<input type="password" className="form-control" id="inputPassword" placeholder="Enter password" required />
							</div>
							<div className="form-group text-center">
								<p>Who are you signing in as?</p>
								<div className="form-check form-check-inline">
									<input className="form-check-input" type="radio" id="user-account" name="account-type" value="user" required />
									<label className="form-check-label" for="user-account">User</label>
								</div>
								<div className="form-check form-check-inline">
									<input className="form-check-input" type="radio" id="dev-account" name="account-type" value="developer" />
									<label className="form-check-label" for="dev-account">Developer</label>
								</div>
								<div className="form-check form-check-inline">
									<input className="form-check-input" type="radio" id="admin-account" name="account-type" value="admin" />
									<label className="form-check-label" for="admin-account">Administrator</label>
								</div>
							</div>
							<div className="form-group text-center">
								<button type="submit" className="btn btn-dark">Sign In</button>
							</div>
						</form>
					</div>
		        </div>
			</div>
		);
	}
}