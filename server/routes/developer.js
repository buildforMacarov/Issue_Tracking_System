const express = require('express');

const Developer = require('../models/developer');

const { authenticateDev } = require('../middleware/authenticate');

const router = express.Router();

router.get('/', (req, res) => {
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

router.get('/issues', authenticateDev, (req, res) => {
	req.developer.findAllIssues()
		.then(issues => {
			if (issues.length === 0) {
				return res.status(404).send();
			}
			res.json({ issues });
		})
		.catch(error => res.status(400).send());
});

router.get('/:id', (req, res) => {
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

module.exports = router;
