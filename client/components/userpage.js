import React from 'react';

import { Navbar } from './navbar';
import { IssueGrid } from './issuegrid';

export class UserPage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Navbar username="foo123" />
				<IssueGrid />
			</div>
		);
	}
}