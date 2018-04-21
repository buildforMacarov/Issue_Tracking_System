import React from 'react';

import PostIssue from './postissue';
import PostAssignment from './postassignment';

export class Navbar extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const navAction = {
			user: <PostIssue className="nav-item nav-link" />,
			admin: <PostAssignment className="nav-item nav-link" />,
			developer: null
		}[this.props.userType];

		return (
			<nav className="Navbar navbar navbar-expand-lg navbar-dark bg-dark">
				<a className="navbar-brand" href="#">
					<div>{this.props.mainLabel}</div>
					<small class="text-muted">{this.props.subLabel}</small>
				</a>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
					<div className="navbar-nav ml-auto">
						{navAction}
					</div>
				</div>
			</nav>
		);
	}
}