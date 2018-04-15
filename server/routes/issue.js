const express = require('express');

const Issue = require('../models/issue');

const router = express.Router();

router.get('/', (req, res) => {
	Issue.findAll()
		.then(issues => {
			if (issues.length === 0) {
				return res.status(404).send();
			}
			res.json({ issues });
		})
		.catch(error => res.status(400).send());
});

router.get('/:id', (req, res) => {
	Issue.findById(req.params.id)
		.then(issue => {
			if (!issue) {
				return res.status(404).send();
			}
			res.json({ issue });
		})
		.catch(error => res.status(400).send());
});

module.exports = router;
