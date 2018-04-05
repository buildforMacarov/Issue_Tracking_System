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
	}

	componentDidMount() {
		axios.get(`/users/${this.props.userId}/issues`)
			.then(res => {
				console.log(res);
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
				<div className="container">
					{
						issues.map(issue => (
							<div className="row">
								<div className="col">
									<IssueCard
										id={issue.id}
										heading={issue.heading}
										description={issue.description}
										status={issue.status}
										time={issue.time}
									/>
								</div>
							</div>
						))
					}
				</div>
			);
		}
	}
}
