const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../db/database');
const Token = require('./token');
const Issue = require('./issue');

const tables = require('../db/tables.json');
const { ADMIN, TOKEN, ISSUE } = tables.entities;
const { DEV_ISSUE, ADMIN_TOKEN } = tables.relationships;

class Admin {
	constructor(config) {
		this.id = config.id || null;
		this.name = config.name;
		this.email = config.email;
		this.password = config.password;
	}

	/* INSTANCE METHODS */

	save() {
		return bcrypt.hash(this.password, 12)
			.then(hash => {
				this.password = hash;
				return db.query('insert into ?? set ?', [ADMIN, this]);
			})
			.then(insertRes => Admin.findById(insertRes.insertId));
	}

	toPublic() {
		return {
			id: this.id,
			name: this.name,
			email: this.email
		};
	}

	insertAssignment(devId, issueId) {
		return db.query('insert into ?? set ?', [DEV_ISSUE, {
			admin_id: this.id,
			developer_id: devId,
			issue_id: issueId
		}])
		.then(insertRes => Issue.findById(issueId))
		.then(issue => {
			if (!issue) return Promise.reject();
			return issue.updateStatus('ongoing');
		});
	}

	findAllTokens() {
		const sql = `
			select ${TOKEN}.*
			from ${ADMIN} inner join ${ADMIN_TOKEN} on ${ADMIN}.id = ${ADMIN_TOKEN}.admin_id
			inner join ${TOKEN} on ${ADMIN_TOKEN}.token_id = ${TOKEN}.id
			where ${ADMIN}.id = ?
		`;
		return db.query(sql, [this.id])
			.then(rows => rows.map(row => new Token(row)));
	}

	generateAuthToken() {
		const tokenVal = jwt.sign({
			password: this.password
		}, process.env.JWT_SECRET);

		const token = new Token({ tokenVal });  // token without id
		return token.save()
				.then(token => {
					return db.query('insert into ?? set ?', [ADMIN_TOKEN, {
						admin_id: this.id,
						token_id: token.id
					}])
					.then(() => token);  // token with id
				});
	}

	/* STATIC FIELDS */

	/* STATIC METHODS */

	static findAll() {
		return db.query('select * from ??', [ADMIN])
			.then(rows => rows.map(row => new Admin(row)));
	}

	static findById(id) {
		return db.query('select * from ?? where id = ?', [ADMIN, id])
			.then(rows => {
				if (rows.length === 0) {
					return Promise.resolve(null);
				}
				return new Admin(rows[0]);
			});
	}

	static findByEmail(email) {
		return db.query('select * from ?? where email = ?', [ADMIN, email])
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
			select ${ADMIN}.*
			from ${ADMIN} inner join ${ADMIN_TOKEN} on ${ADMIN}.id = ${ADMIN_TOKEN}.admin_id
			inner join ${TOKEN} on ${ADMIN_TOKEN}.token_id = ${TOKEN}.id
			where ${TOKEN}.tokenVal = ? and ${ADMIN}.password = ?
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
