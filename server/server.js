require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const db = require('./db/database');

const userRouter = require('./routes/user');
const issueRouter = require('./routes/issue');
const developerRouter = require('./routes/developer');
const adminRouter = require('./routes/admin');

const logger = require('./middleware/logger');

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

const server = app.listen(3000, () => {
	console.log('Listening at port 3000...');
});

module.exports = { app };
