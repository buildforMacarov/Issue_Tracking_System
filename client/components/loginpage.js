import React from 'react';
import axios from 'axios';

export class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			infoAvail: false,
			userInfo: null,
			error: null
		};
		// this.request = axios.create({
		// 	baseURL: `/${props.userType}s`,
		// 	timeout: 3000,
		// 	headers: {
		// 		'x-auth': props.AUTHTOKEN
		// 	}
		// });
	}

	// componentDidMount() {
	// 	this.request.get('/me')
	// 		.then(res => {
	// 			this.setState({
	// 				infoAvail: true,
	// 				userInfo: res.data[this.props.userType]
	// 			});
	// 		}, error => {
	// 			this.setState({
	// 				infoAvail: true,
	// 				error
	// 			});
	// 		});
	// }

	render() {
		return (
			<div className="Login-page container">
		        <div className="row">
					<div className="col">
						<form>
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
									<label className="form-check-label" for="user-account">user</label>
								</div>
								<div className="form-check form-check-inline">
									<input className="form-check-input" type="radio" id="dev-account" name="account-type" value="developer" />
									<label className="form-check-label" for="dev-account">developer</label>
								</div>
								<div className="form-check form-check-inline">
									<input className="form-check-input" type="radio" id="admin-account" name="account-type" value="admin" />
									<label className="form-check-label" for="admin-account">admin</label>
								</div>
							</div>
							<div className="form-group text-center">
								<button type="submit" className="btn btn-primary">Sign In</button>
							</div>
						</form>
					</div>
		        </div>
			</div>
		);
	}
}