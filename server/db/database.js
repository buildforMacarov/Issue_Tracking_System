const mysql = require('mysql');
const fs = require('fs');

class Database {
	constructor(config) {
		this.connection = mysql.createConnection(config);

		// Alternative:
		// const { user, password, host, port, db } = config;
		// this.onnection = mysql.createConnection(`mysql://${user}:${password}@${host}:${port}/${db}`);
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
}

module.exports = Database;
