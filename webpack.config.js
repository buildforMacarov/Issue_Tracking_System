const path = require('path');

module.exports = {
	entry: './client/app.js',
	output: {
		path: path.resolve(__dirname, 'public/dist'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: { presets: ['env', 'react'] }
			}
		]
	}
};