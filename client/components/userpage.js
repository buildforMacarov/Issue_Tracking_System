import React from 'react';
import axios from 'axios';

import { Navbar } from './navbar';
import { IssueGrid } from './issuegrid';

export class UserPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			infoAvail: false,
			userInfo: null,
			error: null
		};
		this.request = axios.create({
			baseURL: '/users',
			timeout: 3000,
			headers: {
				'x-auth': props.AUTHTOKEN
			}
		});
	}

	componentDidMount() {
		this.request.get('/me')
			.then(res => {
				this.setState({
					infoAvail: true,
					userInfo: res.data.user
				});
			}, error => {
				this.setState({
					infoAvail: true,
					error
				});
			});
	}

	render() {
		const { error, infoAvail, userInfo } = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else if (!infoAvail) {
			return <div>Loading...</div>;
		} else {
			return (
				<div>
					<Navbar mainLabel={userInfo.name} />
					<IssueGrid
						userId={this.props.id}
						request={this.request}
					/>
				</div>
			);
		}
	}
}