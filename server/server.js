require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const Database = require('./db/database');
const { respondWithData, respondWithError } = require('./utils/sqlhandlers');
const logger = require('./middleware/logger');

const app = express();
const db = new Database({
	user: process.env.DBUSER,
	password: process.env.PASSWORD,  // needs to be defined if DBUSER === 'root'
	host: 'localhost',
	database: process.env.DB
});

db.connect()
	.then(response => console.log(response, `: ${process.env.DB} db`));

// Middleware:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger);
app.use(express.static(__dirname + '/../public'));

app.get('/issues', (req, res) => {
	const sql = 'SELECT * FROM issues';
	db.query(sql)
		.then(respondWithData(res))
		.catch(respondWithError(res));
});

app.get('/issues/:id', (req, res) => {
	const sql = 'SELECT * FROM issues WHERE id = ?';
	db.query(sql, [req.params.id])
		.then(respondWithData(res))
		.catch(respondWithError(res));
});

app.get('/users', (req, res) => {
	const sql = 'SELECT id, name, email FROM users';
	db.query(sql)
		.then(respondWithData(res))
		.catch(respondWithError(res));
});

app.get('/users/:id', (req, res) => {
	const sql = 'SELECT id, name, email FROM users WHERE id = ?';
	db.query(sql, [req.params.id])
		.then(respondWithData(res))
		.catch(respondWithError(res));
});

app.get('/users/:userId/issues', (req, res) => {
	const sql = `
		SELECT issues.*
		FROM users INNER JOIN user_issues ON users.id = user_issues.user_id
		INNER JOIN issues ON user_issues.issue_id = issues.id
		WHERE users.id = ?
	`;
	db.query(sql, [req.params.userId])
		.then(respondWithData(res))
		.catch(respondWithError(res));
});

app.get('/developers', (req, res) => {
	const sql = 'SELECT id, name, email FROM developers';
	db.query(sql)
		.then(respondWithData(res))
		.catch(respondWithError(res));
});

app.get('/developers/:id', (req, res) => {
	const sql = 'SELECT id, name, email FROM developers WHERE id = ?';
	db.query(sql, [req.params.id])
		.then(respondWithData(res))
		.catch(respondWithError(res));
});

app.get('/developers/:developerId/issues', (req, res) => {
	const sql = `
		SELECT issues.*
		FROM developers INNER JOIN developer_issues ON developers.id = developer_issues.developer_id
		INNER JOIN issues ON developer_issues.issue_id = issues.id
		WHERE developers.id = ?
	`;
	db.query(sql, [req.params.developerId])
		.then(respondWithData(res))
		.catch(respondWithError(res));
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
		const relInsertResult = await db.query('insert into user_issues set ?', {
			user_id: users[0].id,
			issue_id: issues[0].id
		});

		res.send({
			user: users[0],
			issue: issues[0]
		});
	} catch (error) {
		res.status(400).send();
	}
});

const server = app.listen(3000, () => {
	console.log('Listening at port 3000...');
});

module.exports = { app, db };
