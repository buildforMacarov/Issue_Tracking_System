const fs = require('fs');

module.exports = (req, res, next) => {
	const now = new Date().toString();
	const log = `${now} ${req.method} ${req.originalUrl}`;
	fs.appendFile(__dirname + '/../server.log', log + '\n', (err) => {
		if (err) throw err;
	});
	next();
};
