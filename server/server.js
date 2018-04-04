require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const Database = require('./db/database');
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
	db.query('SELECT * FROM issues')
		.then(rows => {
			if (rows.length === 0) {
				return res.status(404).send();
			}
			res.json({ issues: rows });
		})
		.catch(error => res.status(400).send());
});

app.get('/issues/:id', (req, res) => {
	db.query('SELECT * FROM issues WHERE id = ?', [req.params.id])
		.then(rows => {
			if (rows.length === 0) {
				return res.status(404).send();
			}
			res.json({ issue: rows[0] });
		})
		.catch(error => res.status(400).send());
});

app.get('/users', (req, res) => {
	db.query('SELECT id, name, email FROM users')
		.then(rows => {
			if (rows.length === 0) {
				return res.status(404).send();
			}
			res.json({ users: rows });
		})
		.catch(error => res.status(400).send());
});

app.get('/users/:id', (req, res) => {
	db.query('SELECT id, name, email FROM users WHERE id = ?', [req.params.id])
		.then(rows => {
			if (rows.length === 0) {
				return res.status(404).send();
			}
			res.json({ user: rows[0] });
		})
		.catch(error => res.status(400).send());
});

app.get('/users/:userId/issues', (req, res) => {
	const sql = `
		SELECT issues.*
		FROM users INNER JOIN user_issue_open ON users.id = user_issue_open.user_id
		INNER JOIN issues ON user_issue_open.issue_id = issues.id
		WHERE users.id = ?
	`;
	db.query(sql, [req.params.userId])
		.then(rows => {
			if (rows.length === 0) {
				return res.status(404).send();
			}
			res.json({ issues: rows });
		})
		.catch(error => res.status(400).send());
});

app.get('/developers', (req, res) => {
	db.query('SELECT id, name, email FROM developers')
		.then(rows => {
			if (rows.length === 0) {
				return res.status(404).send();
			}
			res.json({ developers: rows });
		})
		.catch(error => res.status(400).send());
});

app.get('/developers/:id', (req, res) => {
	db.query('SELECT id, name, email FROM developers WHERE id = ?', [req.params.id])
		.then(rows => {
			if (rows.length === 0) {
				return res.status(404).send();
			}
			res.json({ developer: rows[0] });
		})
		.catch(error => res.status(400).send());
});

app.get('/developers/:developerId/issues', (req, res) => {
	const sql = `
		SELECT issues.*
		FROM developers INNER JOIN developer_issue_assignment ON developers.id = developer_issue_assignment.developer_id
		INNER JOIN issues ON developer_issue_assignment.issue_id = issues.id
		WHERE developers.id = ?
	`;
	db.query(sql, [req.params.developerId])
		.then(rows => {
			if (rows.length === 0) {
				return res.status(404).send();
			}
			res.json({ issues: rows });
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

const server = app.listen(3000, () => {
	console.log('Listening at port 3000...');
});

module.exports = { app, db };
