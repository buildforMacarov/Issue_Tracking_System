require('dotenv').config();

const mysql = require('mysql');

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

connection.connect(error => {
	if (error) throw error;
	console.log('Connected!');
});
connection.query('DESCRIBE Animal', printResponse);
connection.query('SELECT * FROM Animal', printResponse);
connection.end();

function printResponse(error, response) {
	if (error) throw error;
	console.log('Response:\n' + JSON.stringify(response, null, 4));
}
