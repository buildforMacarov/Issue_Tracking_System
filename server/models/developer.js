const bcrypt = require('bcrypt');

const db = require('../db/database');
const Issue = require('./issue');

class Developer {
	constructor(config) {
		this.id = config.id;
		this.name = config.name;
		this.email = config.email;
		this.password = config.password;
	}

	/* INSTANCE METHODS */

	findAllIssues() {
		const sql = `
			SELECT ${Issue.table}.*
			FROM ${Developer.table} INNER JOIN ${Developer.rel.issue} ON ${Developer.table}.id = ${Developer.rel.issue}.developer_id
			INNER JOIN ${Issue.table} ON ${Developer.rel.issue}.issue_id = ${Issue.table}.id
			WHERE ${Developer.table}.id = ?
		`;
		return db.query(sql, [this.id]);
	}


	/* STATIC FIELDS */

	static get table() {
		return 'developers';
	}

	static get rel() {
		return {
			issue: 'developer_issue_assignment'
		};
	}

	/* STATIC METHODS */

	static findAll() {
		return db.query('select * from ??', [Developer.table]);
	}

	static findById(id) {
		return db.query('select * from ?? where id = ?', [Developer.table, id])
			.then(devs => {
				if (devs.length === 0) {
					return Promise.resolve(null);
				}
				return new Developer(devs[0]);
			});
	}

	static findByEmail(email) {
		return db.query('select * from ?? where email = ?', [Developer.table, email])
			.then(devs => {
				if (devs.length === 0) {
					return Promise.resolve(null);
				}
				return new Developer(devs[0]);
			});
	}

	static findByCredentials(email, password) {
		return Developer.findByEmail(email)
			.then(dev => {
				if (!dev) {
					return Promise.reject({ message: 'Email not registered' });
				}
				return bcrypt.compare(password, dev.password)
					.then(res => {
						if (res) {
							return dev;
						} else {
							return Promise.reject({ message: 'Invalid password' });
						}
					});
			});
	}
}

module.exports = Developer;
