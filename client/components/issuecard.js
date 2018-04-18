import React from 'react';
import axios from 'axios';

export class IssueCard extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { id, heading, description, status, time } = this.props;

		return (
			<div className="Issue-card">
				<div className="Issue-card__head d-flex w-100 justify-content-between">
					<h5>{heading}</h5>
					<span>#{id}</span>
				</div>
				<div className="Issue-card__body">
					<p>{description}</p>
				</div>
			</div>
		);
	}
}
