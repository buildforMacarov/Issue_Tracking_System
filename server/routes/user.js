const express = require('express');

const User = require('../models/user');

const { authenticateUser } = require('../middleware/authenticate');

const router = express.Router();

router.get('/', (req, res) => {
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

router.get('/issues', authenticateUser, (req, res) => {
	req.user.findAllIssues()
		.then(issues => {
			if (issues.length === 0) {
				return res.status(404).send();
			}
			const assigneePromises = issues.map(issue => issue.getAssignees());
			return Promise.all(assigneePromises)
				.then(assignees => {
					debugger;
					issues.forEach((issue, i) => {
						issue.assignees = assignees[i];
					});
					debugger;
					res.json({ issues });
				});
		})
		.catch(error => res.status(400).send());
});

router.patch('/issues/:id', authenticateUser, (req, res) => {
	const { status } = req.body;
	const id = Number(req.params.id);

	req.user.findAllIssues()
		.then(issues => issues.find(issue => issue.id === id))
		.then(issue => {
			if (typeof issue === 'undefined') {
				return res.status(404).send();
			}
			return issue.updateStatus(status);
		})
		.then(issue => res.send({ issue }))
		.catch(error => res.status(400).send());
});

router.get('/:id', (req, res) => {
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

router.post('/login', (req, res) => {
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

router.post('/signup', (req, res) => {
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

router.post('/issues', authenticateUser, (req, res) => {
	const { heading, description } = req.body;

	req.user.insertIssue({ heading, description })
		.then(issue => res.json({ issue }))
		.catch(error => res.status(400).send());
});

module.exports = router;
