const jwt = require('jsonwebtoken');

const { db } = require('./../server');
const User = require('../models/user');

const authenticateUser = (req, res, next) => {
	const tokenVal = req.header('x-auth');
	User.findByToken(tokenVal)
		.then(user => {
			if (!user) {
				return Promise.reject();
			}
			req.user = user;
			req.tokenVal = tokenVal;
			next();
		})
		.catch(() => res.status(401).send());
};

module.exports = { authenticateUser };
