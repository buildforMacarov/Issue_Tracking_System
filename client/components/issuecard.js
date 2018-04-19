import React from 'react';
import moment from 'moment';

export class IssueCard extends React.Component {
	render() {
		const { id, heading, description, status, time } = this.props;

		return (
			<div className="Issue-card">
				<div className="Issue-card__head d-flex w-100 justify-content-between">
					<h5>{heading}</h5>
					<span>#{id}</span>
				</div>
				<div className="Issue-card__body">
					<p className="Issue-card__desc">{description}</p>
				</div>
				<div className="Issue-card__footer d-flex w-100 justify-content-between">
					<p className="Issue-card__time text-muted">{formattedDateTime(time)}</p>
					<p className={`Issue-card__status Issue-card__status--${status}`}>{status}</p>
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
