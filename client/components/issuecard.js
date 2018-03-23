import React from 'react';

export class IssueCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = { diseaseOn: true }

		this.toggleOpen = this.toggleOpen.bind(this);
	}

	toggleOpen() {
		this.setState(prevState => ({
			diseaseOn: !prevState.diseaseOn
		}));
	}

	render() {
		const { id, type, diseaseBegin, disease } = this.props;

		return (
			<div className="card">
				<div className="card-body">
					<h5 className="card-title">ID: {id}</h5>
					<h6 className="card-subtitle">Type: {type}</h6>
					<p className="card-text">Began on: {diseaseBegin}</p>
					<button
						type="button"
						className={this.state.diseaseOn ? 'btn btn-success' : 'btn btn-danger'}
						onClick={this.toggleOpen}>
						{disease ? disease : 'Healthy'}
					</button>
				</div>
			</div>
		);
	}
}
