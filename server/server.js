require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const db = require('./db/database');

const User = require('./models/user');
const Developer = require('./models/developer');
const Admin = require('./models/admin');
const Issue = require('./models/issue');

const userRouter = require('./routes/user');
const issueRouter = require('./routes/issue');
const developerRouter = require('./routes/developer');
const adminRouter = require('./routes/admin');

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

app.use('/issues', issueRouter);
app.use('/users', userRouter);
app.use('/developers', developerRouter);
app.use('/admins', adminRouter);

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

const server = app.listen(3000, () => {
	console.log('Listening at port 3000...');
});

module.exports = { app };
