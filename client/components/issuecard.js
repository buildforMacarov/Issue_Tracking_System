import React from 'react';
import axios from 'axios';

export class IssueCard extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { id, heading, description, time, status } = this.props;

		return (
			<div className="card">
				<div className="card-body">
					<h5 className="card-title">{heading}</h5>
					<h6 className="card-subtitle">#{id}</h6>
					<p className="card-text">{description}</p>
					<button
						type="button"
						className={status === 'open' ? 'btn btn-success' : 'btn btn-danger'}
						disabled>
						{status === 'open' ? 'Open' : 'Closed'}
					</button>
				</div>
				<small class="text-muted">{time}</small>
			</div>
		);
	}
}
