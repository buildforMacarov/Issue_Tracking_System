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
			users = users.map(user => ({
				id: user.id,
				email: user.email,
				name: user.name
			}));
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
			user = {
				id: user.id,
				email: user.email,
				name: user.name
			};
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
			devs = devs.map(dev => ({
				id: dev.id,
				name: dev.name,
				email: dev.email
			}));
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
			dev = {
				id: dev.id,
				name: dev.name,
				email: dev.email
			};
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
			admins = admins.map(admin => ({
				id: admin.id,
				name: admin.name,
				email: admin.email
			}));
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
			admin = {
				id: admin.id,
				name: admin.name,
				email: admin.email
			};
			res.json({ admin });
		})
		.catch(error => res.status(400).send());
});

app.post('/issues/:userId', async (req, res) => {
	const { heading, description } = req.body;
	try {
		const users = await db.query('select id, name, email from users where id = ?', [req.params.userId]);
		if (users.length === 0) throw new Error('No user by that ID');

		const insertResult = await db.query('INSERT INTO issues SET ?', {
			id: null,
			heading,
			description,
			time: null,
			status: 'open'
		});

		const issues = await db.query('SELECT * FROM issues WHERE id = ?', [insertResult.insertId]);
		const relInsertResult = await db.query('insert into user_issue_open set ?', {
			user_id: users[0].id,
			issue_id: issues[0].id
		});

		res.send({
			issue: issues[0]
		});
	} catch (error) {
		res.status(400).send();
	}
});

app.post('/assignment', (req, res) => {
	const { developerId, issueId } = req.body;
	db.query('insert into developer_issue_assignment set ?', {
		developer_id: developerId,
		issue_id: issueId
	})
	.then(result => {
		res.status(200).send();
	})
	.catch(error => res.status(400).send());
});

app.post('/users/login', (req, res) => {
	const { email, password } = req.body;

	db.query('select * from users where email = ?', [email])
		.then(rows => {
			if (rows.length === 0) {
				return Promise.reject({ message: 'Email not registered' });
			}
			const user = rows[0];
			bcrypt.compare(password, user.password)
				.then(compareRes => {
					if (compareRes) {
						return user;
					} else {
						return Promise.reject({ message: 'Invalid password' });
					}
				});
		})
		.then(user => {
			// generateAuthToken
		})
		.catch(error => res.status(404).send());
});

const server = app.listen(3000, () => {
	console.log('Listening at port 3000...');
});

module.exports = { app };
