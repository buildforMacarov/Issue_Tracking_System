import React from 'react';
import axios from 'axios';

import { IssueCard } from './issuecard';

export class IssueGrid extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			issues: []
		}

		this.reloadIssues = this.reloadIssues.bind(this);
	}

	componentDidMount() {
		this.props.request.get('/issues')
			.then(res => {
				this.setState({
					isLoaded: true,
					issues: res.data.issues
				});
			},
			error => {
				this.setState({	
					isLoaded: true,
					error
				});
			});
	}

	reloadIssues() {
		this.setState({
			isLoaded: false
		});

		this.props.request.get('/issues')
			.then(res => {
				this.setState({
					isLoaded: true,
					issues: res.data.issues
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
		const { error, isLoaded, issues } = this.state;

		if (error) {
			return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
			return <div>Loading...</div>;
		} else {
			return (
				<div className="container Issue-grid">
					<div className="row Issue-grid__reload">
						<div className="col text-center">
							<button type="button" className="btn btn-dark" onClick={this.reloadIssues}>Reload Issues</button>
						</div>
					</div>
					{
						issues.map(issue => (
							<div className="row Issue-grid__row">
								<div className="col">
									<IssueCard issueInfo={issue} userType={this.props.userType} />
								</div>
							</div>
						))
					}
				</div>
			);
		}
	}
}
