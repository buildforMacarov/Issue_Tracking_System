const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../db/database');
const Token = require('./token');

class Admin {
	constructor(config) {
		this.id = config.id || null;
		this.name = config.name;
		this.email = config.email;
		this.password = config.password;
	}

	/* INSTANCE METHODS */

	toPublic() {
		return {
			id: this.id,
			name: this.name,
			email: this.email
		};
	}

	insertAssignment(devId, issueId) {
		return db.query('insert into ?? set ?', [Admin.rel.issue, {
			admin_id: this.id,
			developer_id: devId,
			issue_id: issueId
		}]);
	}


	/* STATIC FIELDS */

	static get table() {
		return 'admins';
	}

	static get rel() {
		return {
			issue: 'developer_issue_assignment',
			token: 'admin_tokens'
		};
	}

	/* STATIC METHODS */

	static findAll() {
		return db.query('select * from ??', [Admin.table])
			.then(rows => rows.map(row => new Admin(row)));
	}

	static findById(id) {
		return db.query('select * from ?? where id = ?', [Admin.table, id])
			.then(rows => {
				if (rows.length === 0) {
					return Promise.resolve(null);
				}
				return new Admin(rows[0]);
			});
	}

	static findByEmail(email) {
		return db.query('select * from ?? where email = ?', [Admin.table, email])
			.then(rows => {
				if (rows.length === 0) {
					return Promise.resolve(null);
				}
				return new Admin(rows[0]);
			});
	}

	static findByCredentials(email, password) {
		return Admin.findByEmail(email)
			.then(admin => {
				if (!admin) {
					return Promise.reject({ message: 'Email not registered' });
				}
				return bcrypt.compare(password, admin.password)
					.then(res => {
						if (res) {
							return admin;
						} else {
							return Promise.reject({ message: 'Invalid password' });
						}
					});
			});
	}

	static findByToken(tokenVal) {
		let decoded;
		try {
			decoded = jwt.verify(tokenVal, process.env.JWT_SECRET);
		} catch (error) {
			return Promise.reject();
		}

		const sql = `
			select ${Admin.table}.*
			from ${Admin.table} inner join ${Admin.rel.token} on ${Admin.table}.id = ${Admin.rel.token}.admin_id
			inner join ${Token.table} on ${Admin.rel.token}.token_id = ${Token.table}.id
			where ${Token.table}.tokenVal = ? and ${Admin.table}.password = ?
		`;
		return db.query(sql, [tokenVal, decoded.password])
			.then(rows => {
				if (rows.length === 0) {
					return Promise.resolve(null);
				}
				return new Admin(rows[0]);
			});
	}
}

module.exports = Admin;
