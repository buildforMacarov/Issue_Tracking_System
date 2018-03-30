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
		axios.get('/issues')
			.then(res => {
				console.log(res);
				this.setState({
					isLoaded: true,
					issues : res.data.rows
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
					{issues.map(issue => (
						<div className="row">
							<div className="col">
								<IssueCard
									id={issue.id}
									heading={issue.heading}
									time={issue.time}
									description={issue.description}
									status={issue.status}
								/>
							</div>
						</div>
					))}
				</div>
			);
		}
	}
}
