import React from 'react';
import ReactDOM from 'react-dom';

import { IssueGrid } from './components/issuegrid';

const cardTexts = [
	{
		heading: 'sdlfj',
		body: 'sdfasdfsdfasdfs',
		opener: 'sdfsdf'
	},
	{
		heading: 'sdfsdf',
		body: 'rtyrtyrtyetryrthfghfgh',
		opener: 'fghfgh'
	},
	{
		heading: 'tyutytr',
		body: 'gjdhdtdhhdrtyrtrty trhdfhfth',
		opener: 'jghjg'
	},
	{
		heading: 'drtyrth',
		body: 'fghdtydrtt rthrthrth drth fgh ',
		opener: 'fhdhfgh'
	}
];

ReactDOM.render(
	<IssueGrid cardTexts={cardTexts} />,
	document.getElementById('root')
);