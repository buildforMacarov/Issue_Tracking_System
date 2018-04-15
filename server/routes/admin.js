const express = require('express');

const Admin = require('../models/admin');

const { authenticateAdmin } = require('../middleware/authenticate');

const router = express.Router();

router.get('/', (req, res) => {
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

router.get('/me', authenticateAdmin, (req, res) => {
	const admin = req.admin.toPublic();
	res.json({ admin });
});

router.get('/:id', (req, res) => {
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

router.post('/login', (req, res) => {
	const { email, password } = req.body;

	Admin.findByCredentials(email, password)
		.then(admin => {
			return admin.generateAuthToken()
				.then(token => {
					admin = admin.toPublic();
					res.header('x-auth', token.tokenVal).send({ admin });
				});
		})
		.catch(error => res.status(404).send());
});

router.post('/signup', (req, res) => {
	const admin = new Admin({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	});  // admin with id = null
	admin.save()
		.then(_admin => {
			return _admin.generateAuthToken()  // user with an id
				.then(token => {
					_admin = _admin.toPublic();
					res.header('x-auth', token.tokenVal).send({ admin: _admin });
				});
		})
		.catch(error => res.status(400).send());
});

router.post('/assignment', authenticateAdmin, (req, res) => {
	const { developerId, issueId } = req.body;
	req.admin.insertAssignment(developerId, issueId)
		.then(() => res.status(200).send())
		.catch(error => res.status(400).send());
});

module.exports = router;
