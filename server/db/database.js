const mysql = require('mysql');
const fs = require('fs');

class Database {
	constructor(config) {
		this.connection = mysql.createConnection(config);

		// Alternative:
		// const { user, password, host, port, db } = config;
		// this.onnection = mysql.createConnection(`mysql://${user}:${password}@${host}:${port}/${db}`);

		// 'this' has to be bound to the methods that refer to the other methods :(
		this.resetSeed = this.resetSeed.bind(this);
	}

	connect() {
		return new Promise((resolve, reject) => {
			this.connection.connect(error => {
				if (error) reject(error);
				resolve('Connected to mysql database');
			});
		});
	}

	query(sql, args) {
		return new Promise((resolve, reject) => {
			this.connection.query(sql, args, (error, rows, fields) => {
				if (error) {
					reject(error);
				}
				resolve(rows);
			});
		});
	}
	
	close() {
		return new Promise((resolve, reject) => {
			this.connection.end(error => {
				if (error) {
					reject(error);
				}
				resolve();
			});
		});
	}

	resetSeed() {
		return new Promise((resolve, reject) => {
			fs.readFile(__dirname + '/../tests/its_test.sql', 'utf8', (error, data) => {
				if (error) {
					reject(error)
				};
				this.query(data)
					.then(() => console.log('resetted!'))
					.then(() => resolve())
					.catch(error => reject(error));
			});
		});
	}
}

module.exports = Database;
