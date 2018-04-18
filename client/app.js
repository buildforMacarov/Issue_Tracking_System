import React from 'react';
import ReactDOM from 'react-dom';

import { IssueGrid } from './components/issuegrid';
import { IssuePage } from './components/issuepage';

ReactDOM.render(
	<IssuePage
		userType='admin'
		AUTHTOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYSQxMiQyc2dPTVhXTmU4Mjd1QUxZMHdHMlh1Y3BEODk4L3FHWUhjNWxIZ0tldUx0L0FlN2diRndhYSIsImlhdCI6MTUyMzI2NDIxN30.kn34Zc76XRrBH8JxGIYONljP8-YMaaCyF9RU00-1EDE'
	/>,
	document.getElementById('root')
);