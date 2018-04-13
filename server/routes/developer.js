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

router.get('/issues', authenticateDev, async (req, res) => {
	try {
		const issues = await req.developer.findAllIssues();
		if (issues.length === 0) return res.status(404).send();

		const raiserGroupPromises = issues.map(issue => issue.getRaisers());  // Array<Promise<Array<JSON>>>
		const assignerPromises = issues.map(issue => issue.getAssigner(req.developer.id));  // Array<Promise<JSON>>

		const raiserGroups = await Promise.all(raiserGroupPromises);
		issues.forEach((issue, i) => {
			issue.raisers = raiserGroups[i];  // Array<JSON>
		});
		const assigners = await Promise.all(assignerPromises);
		issues.forEach((issue, i) => {
			issue.assigner = assigners[i];  // JSON
		});
		res.json({ issues });
	} catch (error) {
		res.status(400).send();
	}
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

router.post('/login', (req, res) => {
	const { email, password } = req.body;

	Developer.findByCredentials(email, password)
		.then(dev => {
			return dev.generateAuthToken()
				.then(token => {
					dev = dev.toPublic();
					res.header('x-auth', token.tokenVal).send({ developer: dev });
				});
		})
		.catch(error => res.status(404).send());
});

router.post('/signup', (req, res) => {
	const dev = new Developer({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	});  // dev with id = null
	dev.save()
		.then(_dev => {
			return _dev.generateAuthToken()  // dev with an id
				.then(token => {
					_dev = _dev.toPublic();
					res.header('x-auth', token.tokenVal).send({ developer: _dev });
				});
		})
		.catch(error => res.status(400).send());
});


module.exports = router;
