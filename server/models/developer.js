const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../db/database');
const Issue = require('./issue');
const Token = require('./token');

const tables = require('../db/tables.json');
const { DEVELOPER, ISSUE, TOKEN } = tables.entities;
const { DEV_ISSUE, DEV_TOKEN } = tables.relationships;

class Developer {
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
				return db.query('insert into ?? set ?', [DEVELOPER, this]);
			})
			.then(insertRes => Developer.findById(insertRes.insertId));
	}

	toPublic() {
		return {
			id: this.id,
			name: this.name,
			email: this.email
		};
	}

	findAllIssues() {
		const sql = `
			SELECT ${ISSUE}.*
			FROM ${DEVELOPER} INNER JOIN ${DEV_ISSUE} ON ${DEVELOPER}.id = ${DEV_ISSUE}.developer_id
			INNER JOIN ${ISSUE} ON ${DEV_ISSUE}.issue_id = ${ISSUE}.id
			WHERE ${DEVELOPER}.id = ?
		`;
		return db.query(sql, [this.id])
			.then(rows => rows.map(row => new Issue(row)));
	}

	findAllTokens() {
		const sql = `
			select ${TOKEN}.*
			from ${DEVELOPER} inner join ${DEV_TOKEN} on ${DEVELOPER}.id = ${DEV_TOKEN}.developer_id
			inner join ${TOKEN} on ${DEV_TOKEN}.token_id = ${TOKEN}.id
			where ${DEVELOPER}.id = ?
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
					return db.query('insert into ?? set ?', [DEV_TOKEN, {
						developer_id: this.id,
						token_id: token.id
					}])
					.then(() => token);  // token with id
				});
	}

	/* STATIC FIELDS */

	/* STATIC METHODS */

	static findAll() {
		return db.query('select * from ??', [DEVELOPER])
			.then(rows => rows.map(row => new Developer(row)));
	}

	static findById(id) {
		return db.query('select * from ?? where id = ?', [DEVELOPER, id])
			.then(rows => {
				if (rows.length === 0) {
					return Promise.resolve(null);
				}
				return new Developer(rows[0]);
			});
	}

	static findByEmail(email) {
		return db.query('select * from ?? where email = ?', [DEVELOPER, email])
			.then(rows => {
				if (rows.length === 0) {
					return Promise.resolve(null);
				}
				return new Developer(rows[0]);
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

	static findByToken(tokenVal) {
		let decoded;
		try {
			decoded = jwt.verify(tokenVal, process.env.JWT_SECRET);
		} catch (error) {
			return Promise.reject();
		}

		const sql = `
			select ${DEVELOPER}.*
			from ${DEVELOPER} inner join ${DEV_TOKEN} on ${DEVELOPER}.id = ${DEV_TOKEN}.developer_id
			inner join ${TOKEN} on ${DEV_TOKEN}.token_id = ${TOKEN}.id
			where ${TOKEN}.tokenVal = ? and ${DEVELOPER}.password = ?
		`;
		return db.query(sql, [tokenVal, decoded.password])
			.then(rows => {
				if (rows.length === 0) {
					return Promise.resolve(null);
				}
				return new Developer(rows[0]);
			});
	}
}

module.exports = Developer;
