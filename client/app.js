import React from 'react';
import ReactDOM from 'react-dom';

import { IssueGrid } from './components/issuegrid';
import { IssuePage } from './components/issuepage';

ReactDOM.render(
	<IssuePage
		userType='user'
		AUTHTOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYSQxMiRrcGpxcjR2NjhvMmxWbnJ3R3dqVlBPUy9BcEpGTWlReGpsbmEyclJ0VlNaTTlIMU4xQmRtLiIsImlhdCI6MTUyMzIxMjE2M30.GJxwAC7fRAF9UzQ4AaP3r5bnWG8TPXZgw-jfYx0aaJE'
	/>,
	document.getElementById('root')
);