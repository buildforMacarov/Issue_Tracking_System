import React from 'react';
import axios from 'axios';

import { IssueCard } from './issuecard';

export class IssueGrid extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			items: []
		}
	}

	componentDidMount() {
		axios.get('/get/Animal')
			.then(res => {
				console.log(res.data);
				this.setState({
					isLoaded: true,
					items: res.data
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
		const { error, isLoaded, items } = this.state;

		if (error) {
			return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
			return <div>Loading...</div>;
		} else {
			return (
				<div className="container">
					{items.map(item => (
						<div className="row">
							<div className="col">
								<IssueCard
									id={item.AnimalID}
									type={item.AnimalType}
									diseaseBegin={item.Disease_begin}
									disease={item.Disease}
								/>
							</div>
						</div>
					))}
				</div>
			);
		}
	}
}
