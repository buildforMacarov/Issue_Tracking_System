require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const _ = require('lodash');

const app = express();

const USER = 'root',
	PASSWORD = process.env.PASSWORD,
	HOST = 'localhost',
	PORT = '3306',
	DB = process.env.DB;

const connection = mysql.createConnection({
	user: USER,
	password: PASSWORD,
	host: HOST,
	database: DB
});

// Alternative:
// const connection = mysql.createConnection(`mysql://${USER}:${PASSWORD}@${HOST}:${PORT}/${DB}`);

// Middleware:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../public'));

connection.connect(error => {
	if (error) throw error;
	console.log('Connected!');
});

app.get('/issues/:id?', (req, res) => {
	const query = req.params.id
		? `SELECT * FROM issues WHERE id = ${connection.escape(req.params.id)}`
		: 'SELECT * FROM issues';
	connection.query(query, sendData(res));
});

app.get('/users/:id?', (req, res) => {
	const query = req.params.id
		? `SELECT * FROM users WHERE id = ${connection.escape(req.params.id)}`
		: 'SELECT * FROM users';
	connection.query(query, sendData(res));
});

app.get('/users/:userId/issues', (req, res) => {
	const userId = req.params.userId;
	const query = `
		SELECT issues.*
		FROM users INNER JOIN user_issues ON users.id = user_issues.user_id
		INNER JOIN issues ON user_issues.issue_id = issues.id
		WHERE users.id = ${connection.escape(userId)}
	`;
	connection.query(query, sendData(res));
});

function sendData(res) {
	return (error, rows, fields) => {
		if (error) return res.redirect('https://http.cat/400');
		res.json({ rows });
	}
}

const server = app.listen(3000, () => {
	console.log('Listening at port 3000...');
});
