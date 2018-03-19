const path = require('path');

module.exports = {
	entry: './client/app.js',
	output: {
		path: path.resolve(__dirname, 'public/dist'),
		filename: 'bundle.js'
	}
};