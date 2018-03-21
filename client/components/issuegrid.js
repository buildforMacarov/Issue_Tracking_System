import React from 'react';
import { IssueCard } from './issuecard';

export class IssueGrid extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="container">
				<div className="row">
					{
						this.props.cardTexts.map(text => (
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
