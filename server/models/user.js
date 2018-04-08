const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../db/database');
const Issue = require('./issue');
const Token = require('./token');

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
				return db.query('insert into ?? set ?', [User.table, this]);
			})
            .then(insertRes => {
                this.id = insertRes.insertId;
                return this;
            });
	}

	findAllIssues() {
		const sql = `
			SELECT ${Issue.table}.*
			FROM ${User.table} INNER JOIN ${User.rel.issue} ON ${User.table}.id = ${User.rel.issue}.user_id
			INNER JOIN ${Issue.table} ON ${User.rel.issue}.issue_id = ${Issue.table}.id
			WHERE ${User.table}.id = ?
		`;
		return db.query(sql, [this.id]);
	}

	findAllTokens() {
		const sql = `
			select ${Token.table}.*
			from ${User.table} inner join ${User.rel.token} on ${User.table}.id = ${User.rel.token}.user_id
			inner join ${Token.table} on ${User.rel.token}.token_id = ${Token.table}.id
			where ${User.table}.id = ?
		`;
		return db.query(sql, [this.id]);
	}

	generateAuthToken() {
		const tokenVal = jwt.sign({
			password: this.password
		}, process.env.JWT_SECRET);

		const token = new Token({ tokenVal });
		return token.save()
				.then(token => {
					return db.query('insert into ?? set ?', [User.rel.token, {
						user_id: this.id,
						token_id: token.id
					}])
					.then(() => token);
				});
	}


	/* STATIC FIELDS */

	static get table() {
		return 'users';
	}

	static get rel() {
		return {
			issue: 'user_issue_open',
			token: 'user_tokens'
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
			.then(users => {
				if (users.length === 0) {
					return Promise.resolve(null);
				}
				return new User(users[0]);
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
			select ${User.table}.*
			from ${User.table} inner join ${User.rel.token} on ${User.table}.id = ${User.rel.token}.user_id
			inner join ${Token.table} on ${User.rel.token}.token_id = ${Token.table}.id
			where ${Token.table}.tokenVal = ? and ${User.table}.password = ?
		`;
		return db.query(sql, [tokenVal, decoded.password])
			.then(users => {
				if (users.length === 0) {
					return Promise.resolve(null);
				}
				return new User(user[0]);
			});
	}
}

module.exports = User;
