require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const db = require('./db/database');

const User = require('./models/user');
const Developer = require('./models/developer');
const Admin = require('./models/admin');
const Issue = require('./models/issue');

const logger = require('./middleware/logger');
const { authenticateUser } = require('./middleware/authenticate');

const app = express();

db.connect()
	.then(response => console.log(response, `: ${process.env.DB} db`));

// Middleware:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger);
app.use(express.static(__dirname + '/../public'));

app.get('/issues', (req, res) => {
	Issue.findAll()
		.then(issues => {
			if (issues.length === 0) {
				return res.status(404).send();
			}
			res.json({ issues });
		})
		.catch(error => res.status(400).send());
});

app.get('/issues/:id', (req, res) => {
	Issue.findById(req.params.id)
		.then(issue => {
			if (!issue) {
				return res.status(404).send();
			}
			res.json({ issue });
		})
		.catch(error => res.status(400).send());
});

app.get('/users', (req, res) => {
	User.findAll()
		.then(users => {
			if (users.length === 0) {
				return res.status(404).send();
			}
			users = users.map(user => user.toPublic());
			res.json({ users });
		})
		.catch(error => res.status(400).send());
});

app.get('/users/:id', (req, res) => {
	User.findById(req.params.id)
		.then(user => {
			if (!user) {
				return res.status(404).send();
			}
			user = user.toPublic();
			res.json({ user });
		})
		.catch(error => res.status(400).send());
});

app.get('/users/:userId/issues', (req, res) => {
	User.findById(req.params.userId)
		.then(user => {
			if (!user) {
				return res.status(404).send();
			}
			return user.findAllIssues();
		})
		.then(issues => {
			if (issues.length === 0) {
				return res.status(404).send();
			}
			res.json({ issues });
		})
		.catch(error => res.status(400).send());
});

app.get('/developers', (req, res) => {
	Developer.findAll()
		.then(devs => {
			if (devs.length === 0) {
				return res.status(404).send();
			}
			devs = devs.map(dev => dev.toPublic());
			res.json({ developers: devs });
		})
		.catch(error => res.status(400).send());
});

app.get('/developers/:id', (req, res) => {
	Developer.findById(req.params.id)
		.then(dev => {
			if (!dev) {
				return res.status(404).send();
			}
			dev = dev.toPublic();
			res.json({ developer: dev });
		})
		.catch(error => res.status(400).send());
});

app.get('/developers/:developerId/issues', (req, res) => {
	Developer.findById(req.params.developerId)
		.then(dev => {
			if (!dev) {
				return res.status(404).send();
			}
			return dev.findAllIssues();
		})
		.then(issues => {
			if (issues.length === 0) {
				return res.status(404).send();
			}
			res.json({ issues });
		})
		.catch(error => res.status(400).send());
});

app.get('/admins', (req, res) => {
	Admin.findAll()
		.then(admins => {
			if (admins.length === 0) {
				return res.status(404).send();
			}
			admins = admins.map(admin => admin.toPublic());
			res.json({ admins });
		})
		.catch(error => res.status(400).send());
});

app.get('/admins/:id', (req, res) => {
	Admin.findById(req.params.id)
		.then(admin => {
			if (!admin) {
				return res.status(404).send();
			}
			admin = admin.toPublic();
			res.json({ admin });
		})
		.catch(error => res.status(400).send());
});

app.post('/issues/:userId', (req, res) => {
	const { heading, description } = req.body;

	User.findById(req.params.userId)
		.then(user => {
			if (!user) {
				return Promise.reject();
			}
			return user.insertIssue({ heading, description });
		})
		.then(issue => res.json({ issue }))
		.catch(error => res.status(400).send());
});

app.post('/assignment', (req, res) => {
	const { adminId, developerId, issueId } = req.body;
	Admin.findById(adminId)
		.then(admin => {
			if (!admin) {
				return Promist.reject();
			}
			return admin.insertAssignment(developerId, issueId);
		})
		.then(() => res.status(200).send())
		.catch(error => res.status(400).send());
});

app.post('/users/login', (req, res) => {
	const { email, password } = req.body;

	User.findByCredentials(email, password)
		.then(user => {
			return user.generateAuthToken()
				.then(token => {
					user = user.toPublic();
					res.header('x-auth', token.tokenVal).send({ user });
				});
		})
		.catch(error => res.status(404).send());
});

app.post('/users/signup', (req, res) => {
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	});  // user with id = null
	user.save()
		.then(_user => {
			return _user.generateAuthToken()  // user with an id
				.then(token => {
					_user = _user.toPublic();
					res.header('x-auth', token.tokenVal).send({ user: _user });
				});
		})
		.catch(error => res.status(400).send());
});

const server = app.listen(3000, () => {
	console.log('Listening at port 3000...');
});

module.exports = { app };
