const db = require('../db/database');
const Issue = require('./issue');

class User {
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
			FROM ${User.table} INNER JOIN ${User.rel.issue} ON ${User.table}.id = ${User.rel.issue}.user_id
			INNER JOIN ${Issue.table} ON ${User.rel.issue}.issue_id = ${Issue.table}.id
			WHERE ${User.table}.id = ?
		`;
		return db.query(sql, [this.id]);
	}


	/* STATIC FIELDS */

	static get table() {
		return 'users';
	}

	static get rel() {
		return {
			issue: 'user_issue_open'
		};
	}

	/* STATIC METHODS */

	static findAll() {
		return db.query('select * from ??', [User.table]);
	}

	static findById(id) {
		return db.query('select * from ?? where id = ?', [User.table, id])
			.then(users => {
				if (users.length === 0) {
					return Promise.resolve(null);
				}
				return new User(users[0]);
			});
	}

	static findByEmail(email) {
		return db.query('select * from ?? where email = ?', [User.table, email])
			then(users => {
				if (users.length === 0) {
					return Promise.resolve(null);
				}
				return new User(users[0]);
			});
	}
}

module.exports = User;
