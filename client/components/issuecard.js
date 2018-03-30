import React from 'react';
import axios from 'axios';

export class IssueCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: null,
			heading: null,
			description: null,
			time: null,
			status: null
		 }

		 

		this.toggleOpen = this.toggleOpen.bind(this);
	}

	toggleOpen() {
		this.setState(prevState => ({
			status: !prevState.status
		}));
	}

	render() {
		const { id, heading, description, time, status } = this.props;

		return (
			<div className="card">
				<div className="card-body">
					<h5 className="card-title">ID: {id}</h5>
					<h6 className="card-subtitle">HEADING: {heading}</h6>
					<p className="card-text">Began on: {time} Description: {description}</p>
					<button
						type="button"
						className={this.state.status ? 'btn btn-success' : 'btn btn-danger'}
						onClick={this.toggleOpen}>
						{status ? "OPEN" : 'CLOSED'}
					</button>
				</div>
			</div>
		);
	}
}
