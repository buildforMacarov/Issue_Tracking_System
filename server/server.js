require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const logger = require('./middleware/logger');

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
app.use(logger);
app.use(express.static(__dirname + '/../public'));

connection.connect(error => {
	if (error) throw error;
	console.log('Connected!');
});

app.get('/getTables', (req, res) => {
	connection.query(`SHOW TABLES`, handleData(res));
});

app.get('/get/:table', (req, res) => {
	connection.query(`SELECT * FROM ${req.params.table}`, handleData(res));
});

app.get('/describe/:table', (req, res) => {
	connection.query(`DESCRIBE ${req.params.table}`, handleData(res));
});

function handleData(res) {
	return (error, results, fields) => {
		if (error) return res.redirect('https://http.cat/400');
		res.json(results);
	}
}

const server = app.listen(3000, () => {
	console.log('Listening at port 3000...');
});
