const User = require('../models/user');
const Developer = require('../models/developer');
const Admin = require('../models/admin');

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

const authenticateDev = (req, res, next) => {
	const tokenVal = req.header('x-auth');
	Developer.findByToken(tokenVal)
		.then(dev => {
			if (!dev) {
				return Promise.reject();
			}
			req.developer = dev;
			req.tokenVal = tokenVal;
			next();
		})
		.catch(() => res.status(401).send());
};

const authenticateAdmin = (req, res, next) => {
	const tokenVal = req.header('x-auth');
	Admin.findByToken(tokenVal)
		.then(admin => {
			if (!admin) {
				return Promise.reject();
			}
			req.admin = admin;
			req.tokenVal = tokenVal;
			next();
		})
		.catch(() => res.status(401).send());
};

module.exports = {
	authenticateUser,
	authenticateDev,
	authenticateAdmin
};
