const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../db/database');
const Issue = require('./issue');
const Token = require('./token');

const tables = require('../db/tables.json');
const { USER, ISSUE, TOKEN } = tables.entities;
const { USER_ISSUE, USER_TOKEN } = tables.relationships;

class User {
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
				return db.query('insert into ?? set ?', [USER, this]);
			})
			.then(insertRes => User.findById(insertRes.insertId));
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
			FROM ${USER} INNER JOIN ${USER_ISSUE} ON ${USER}.id = ${USER_ISSUE}.user_id
			INNER JOIN ${ISSUE} ON ${USER_ISSUE}.issue_id = ${ISSUE}.id
			WHERE ${USER}.id = ?
		`;
		return db.query(sql, [this.id])
			.then(rows => rows.map(row => new Issue(row)));
	}

	findAllTokens() {
		const sql = `
			select ${TOKEN}.*
			from ${USER} inner join ${USER_TOKEN} on ${USER}.id = ${USER_TOKEN}.user_id
			inner join ${TOKEN} on ${USER_TOKEN}.token_id = ${TOKEN}.id
			where ${USER}.id = ?
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
					return db.query('insert into ?? set ?', [USER_TOKEN, {
						user_id: this.id,
						token_id: token.id
					}])
					.then(() => token);  // token with id
				});
	}

	insertIssue(issueConfig) {
		const issue = new Issue(issueConfig); // issue without id
		return issue.save()
				.then(issue => {
					return db.query('insert into ?? set ?', [USER_ISSUE, {
						user_id: this.id,
						issue_id: issue.id
					}])
					.then(() => issue);  // issue with id
				});
	}

	/* STATIC FIELDS */

	/* STATIC METHODS */

	static findAll() {
		return db.query('select * from ??', [USER])
			.then(rows => rows.map(row => new User(row)));
	}

	static findById(id) {
		return db.query('select * from ?? where id = ?', [USER, id])
			.then(rows => {
				if (rows.length === 0) {
					return Promise.resolve(null);
				}
				return new User(rows[0]);
			});
	}

	static findByEmail(email) {
		return db.query('select * from ?? where email = ?', [USER, email])
			.then(rows => {
				if (rows.length === 0) {
					return Promise.resolve(null);
				}
				return new User(rows[0]);
			});
	}

	static findByCredentials(email, password) {
		return User.findByEmail(email)
			.then(user => {
				if (!user) {
					return Promise.reject({ message: 'Email not registered' });
				}
				return bcrypt.compare(password, user.password)
					.then(res => {
						if (res) {
							return user;
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
			select ${USER}.*
			from ${USER} inner join ${USER_TOKEN} on ${USER}.id = ${USER_TOKEN}.user_id
			inner join ${TOKEN} on ${USER_TOKEN}.token_id = ${TOKEN}.id
			where ${TOKEN}.tokenVal = ? and ${USER}.password = ?
		`;
		return db.query(sql, [tokenVal, decoded.password])
			.then(rows => {
				if (rows.length === 0) {
					return Promise.resolve(null);
				}
				return new User(rows[0]);
			});
	}
}

module.exports = User;
