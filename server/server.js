require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

const USER = 'root',
	PASSWORD = process.env.PASSWORD,
	HOST = 'localhost',
	PORT = '3306',
	DB = 'zoo';

const connection = mysql.createConnection({
	user: USER,
	password: PASSWORD,
	host: HOST,
	database: DB
});

// Alternative:
// const connection = mysql.createConnection(`mysql://${USER}:${PASSWORD}@${HOST}:${PORT}/${DB}`);

// Middleware:
app.use(express.static(__dirname + '/../public'));

connection.connect(error => {
	if (error) throw error;
	console.log('Connected!');
});
connection.query('DESCRIBE Animal', printResponse);
connection.query('SELECT * FROM Animal', printResponse);
connection.end();

function printResponse(error, results, fields) {
	if (error) throw error;
	console.log('Results:\n' + JSON.stringify(results, null, 4));
	console.log('Fields:\n' + JSON.stringify(fields, null, 4));
}

const server = app.listen(3000, () => {
	console.log('Listening at port 3000...');
});
