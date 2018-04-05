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
	}

	componentDidMount() {
		axios.get(`/users/${this.props.id}`)
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
		const { infoAvail, userInfo } = this.state;
		if (infoAvail) {
			return (
				<div>
					<Navbar mainLabel={userInfo.name} />
					<IssueGrid userId={this.props.id} />
				</div>
			);
		} else {
			return (
				<div>
					<Navbar mainLabel="..." />
					<IssueGrid userId={this.props.id} />
				</div>
			);
		}
	}
}