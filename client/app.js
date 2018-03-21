import React from 'react';
import ReactDOM from 'react-dom';

class IssueCard extends React.Component {
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

ReactDOM.render(
	<IssueCard
		heading="Event handler not working as expected"
		body="The events are not triggering as expected in the given module. Something's wrong with the event propagation."
		opener="Dave"
		/>,
	document.getElementById('root')
);