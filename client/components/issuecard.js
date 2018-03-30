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
			open: this.props.status === 'open'
		 }

		 

		this.toggleOpen = this.toggleOpen.bind(this);
	}

	toggleOpen() {
		this.setState(prevState => ({
			open: !prevState.open
		}));
	}

	render() {
		const { id, heading, description, time } = this.props;
		const { open } = this.state;

		return (
			<div className="card">
				<div className="card-body">
					<h5 className="card-title">ISSUE# : {id}</h5>
					<h6 className="card-subtitle">HEADING: {heading}</h6>
					<p className="card-text">Began on: {time} <br /> Description: {description}</p>
					<button
						type="button"
						className={this.state.status ? 'btn btn-success' : 'btn btn-danger'}
						onClick={this.toggleOpen}>
						{open ? 'OPEN' : 'CLOSED'}
					</button>
				</div>
			</div>
		);
	}
}
