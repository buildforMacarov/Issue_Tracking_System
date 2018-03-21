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

class IssueGrid extends React.Component {
	constructor(props) {
		super(props);
		this.cardTexts = [
			{
				heading: 'sdlfj',
				body: 'sdfasdfsdfasdfs',
				opener: 'sdfsdf'
			},
			{
				heading: 'sdfsdf',
				body: 'rtyrtyrtyetryrthfghfgh',
				opener: 'fghfgh'
			},
			{
				heading: 'tyutytr',
				body: 'gjdhdtdhhdrtyrtrty trhdfhfth',
				opener: 'jghjg'
			},
			{
				heading: 'drtyrth',
				body: 'fghdtydrtt rthrthrth drth fgh ',
				opener: 'fhdhfgh'
			}
		]
	}
	render() {
		return (
			<div className="container">
				<div className="row">
					{
						this.cardTexts.map(text => (
							<div className="col">
								<IssueCard
									heading={text.heading}
									body={text.body}
									opener={text.opener}
								/>
							</div>
						))
					}
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<IssueGrid />,
	document.getElementById('root')
);