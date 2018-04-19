import React from 'react';
import ReactDOM from 'react-dom';

import { IssueGrid } from './components/issuegrid';
import { IssuePage } from './components/issuepage';

ReactDOM.render(
	<IssuePage
		userType='developer'
		AUTHTOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYSQxMiRIWFpQU3c0Q29oUVNKUDlLdnMzYThlNkRCbkowQkF1LnlrMS5JbjlJTy9vUjAva3Noc1RQSyIsImlhdCI6MTUyMzI2MzI4MX0.p-jmoRcn8DlQxs3ERFNXHdKE_g_cMOuQg0LcOKptmvA'
	/>,
	document.getElementById('root')
);