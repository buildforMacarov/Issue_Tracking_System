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

router.post('/assignment', authenticateAdmin, (req, res) => {
	const { developerId, issueId } = req.body;
	req.admin.insertAssignment(developerId, issueId)
		.then(() => res.status(200).send())
		.catch(error => res.status(400).send());
});

module.exports = router;
