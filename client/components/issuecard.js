import React from 'react';

export class IssueCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = { open: true }

		this.toggleOpen = this.toggleOpen.bind(this);
	}

	toggleOpen() {
		this.setState(prevState => ({
			open: !prevState.open
		}));
	}

	render() {
		return (
			<div className="card">
				<div className="card-body">
					<h5 className="card-title">{this.props.heading}</h5>
					<h6 className="card-subtitle">Opened by {this.props.opener}</h6>
					<p className="card-text">{this.props.body}</p>
					<button
						type="button"
						className={this.state.open ? 'btn btn-success' : 'btn btn-danger'}
						onClick={this.toggleOpen}>
						{this.state.open ? 'Open' : 'Closed'}
					</button>
				</div>
			</div>
		);
	}
}
