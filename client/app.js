import React from 'react';
import ReactDOM from 'react-dom';

import { IssueGrid } from './components/issuegrid';
import { UserPage } from './components/userpage';

ReactDOM.render(
	<UserPage AUTHTOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYSQxMiRrcGpxcjR2NjhvMmxWbnJ3R3dqVlBPUy9BcEpGTWlReGpsbmEyclJ0VlNaTTlIMU4xQmRtLiIsImlhdCI6MTUyMzIxMjEzNn0.-OfyeL1y8ONTKiVpLFybxNnPVPGmWV4Xx1X7s75yflM" />,
	document.getElementById('root')
);