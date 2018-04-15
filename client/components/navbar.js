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
			<nav className="navbar navbar-expand-lg navbar-light bg-primary">
			  <a className="navbar-brand" href="#">{this.props.username}</a>
			  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
			    <span className="navbar-toggler-icon"></span>
			  </button>
			  <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
			    <div className="navbar-nav">
			      <a className="nav-item nav-link active" onClick={this.printClicked}>Home <span className="sr-only">(current)</span></a>
			      <a className="nav-item nav-link" onClick={this.printClicked}>Features</a>
			      <a className="nav-item nav-link" onClick={this.printClicked}>Pricing</a>
			    </div>
			  </div>
			</nav>
		);
	}
}
