import React from 'react';
import moment from 'moment';

export class IssueCard extends React.Component {
	constructor(props) {
		super(props);

		this.peopleInfo = this.peopleInfo.bind(this);
	}

	peopleInfo() {
		const issueInfo = this.props.issueInfo;
		const muted = 'Issue-card--muted text-muted';
		const badge = str => <span className="badge badge-dark">{str}</span>;
		const peopleList = people => {
			return (
				<ul className="list-inline d-inline">
					{people.map(p => <li className="list-inline-item people-list__item">{badge(p.name)}</li>)}
				</ul>
			);
		};

		const assignees = issueInfo.assignees ? (
			<div>
				<span className={muted}>Assigned to</span> {peopleList(issueInfo.assignees)}
			</div>
		) : null;
		const raisers = issueInfo.raisers ? (
			<div>
				<span className={muted}>Raised by</span> {peopleList(issueInfo.raisers)}
			</div>
		) : null;
		const assigner = issueInfo.assigner ? (
			<div>
				<span className={muted}>Assigned by</span> {badge(issueInfo.assigner.name)}
			</div>
		) : null;

		return {
			user: assignees,
			developer: <div>{raisers}{assigner}</div>,
			admin: <div>{raisers}{assignees}</div>
		}[this.props.userType];
	}

	render() {
		const { id, heading, description, status, time } = this.props.issueInfo;

		return (
			<div className="Issue-card">
				<div className="Issue-card__head d-flex w-100 justify-content-between">
					<h5>{heading}</h5>
					<span>#{id}</span>
				</div>
				<div className="Issue-card__body">
					<p className="Issue-card__desc">{description}</p>
				</div>
				<div className="Issue-card__footer">
					<div className="d-flex w-100 justify-content-between">
						<p className="Issue-card--muted text-muted">{formattedDateTime(time)}</p>
						<p className={`Issue-card__status Issue-card__status--${status}`}>{status}</p>
					</div>
					{this.peopleInfo()}
				</div>
			</div>
		);
	}
}

function formattedDateTime(time) {
	const input = moment(time);
	const now = moment();
	const week = 604800000;
	const cap = str => str.charAt(0).toUpperCase() + str.slice(1);

	const fDate = now.diff(input) <= week ?
		cap(input.from(now)) :
		input.format('DD MMM, YYYY');
	const fTime = input.format('h:mm a');

	return `${fDate} at ${fTime}`;
}
