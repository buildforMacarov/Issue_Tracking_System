const path = require('path');

module.exports = {
	entry: './public/src/app.js',
	output: {
		path: path.resolve(__dirname, 'public/dist'),
		filename: 'bundle.js'
	}
};