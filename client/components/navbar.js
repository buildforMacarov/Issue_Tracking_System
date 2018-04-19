import React from 'react';

export class Navbar extends React.Component {
	constructor(props) {
		super(props);

		this.printClicked = this.printClicked.bind(this);
	}

	printClicked() {
		console.log('Clicked!');
	}

	render() {
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
			    <div className="navbar-nav">
			      <a className="nav-item nav-link active" onClick={this.printClicked}>New Issue<span className="sr-only">(current)</span></a>
			    </div>
			  </div>
			</nav>
		);
	}
}