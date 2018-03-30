import React from 'react';
import ReactDOM from 'react-dom';

import { IssueGrid } from './components/issuegrid';
import { UserPage } from './components/userpage';

ReactDOM.render(
	<UserPage name="Joey Salads" />,
	document.getElementById('root')
);