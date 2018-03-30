import React from 'react';
import axios from 'axios';

import { Navbar } from './navbar';
import { IssueGrid } from './issuegrid';

export class UserPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email : null,
			issue : null
		}
	}

	componentDidMount() {
		axios.get('/users/:id')
			.then(res => {
				console.log(res);
				this.setState({
					isLoaded: true,
					user : res.data.rows
				});
			},
			error => {
				this.setState({
					isLoaded: true,
					error
				});
			});
	}

	render() {
		return (
			<div>
			<Navbar mainLabel={this.props.name} />
				<IssueGrid />
			</div>
		);
	}
}