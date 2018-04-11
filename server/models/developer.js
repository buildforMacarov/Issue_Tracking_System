const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../db/database');
const Issue = require('./issue');
const Token = require('./token');

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
				return db.query('insert into ?? set ?', [Developer.table, this]);
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
			SELECT ${Issue.table}.*
			FROM ${Developer.table} INNER JOIN ${Developer.rel.issue} ON ${Developer.table}.id = ${Developer.rel.issue}.developer_id
			INNER JOIN ${Issue.table} ON ${Developer.rel.issue}.issue_id = ${Issue.table}.id
			WHERE ${Developer.table}.id = ?
		`;
		return db.query(sql, [this.id])
			.then(rows => rows.map(row => new Issue(row)));
	}

	findAllTokens() {
		const sql = `
			select ${Token.table}.*
			from ${Developer.table} inner join ${Developer.rel.token} on ${Developer.table}.id = ${Developer.rel.token}.developer_id
			inner join ${Token.table} on ${Developer.rel.token}.token_id = ${Token.table}.id
			where ${Developer.table}.id = ?
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
					return db.query('insert into ?? set ?', [Developer.rel.token, {
						developer_id: this.id,
						token_id: token.id
					}])
					.then(() => token);  // token with id
				});
	}

	/* STATIC FIELDS */

	static get table() {
		return 'developers';
	}

	static get rel() {
		return {
			issue: 'developer_issue_assignment',
			token: 'developer_tokens'
		};
	}

	/* STATIC METHODS */

	static findAll() {
		return db.query('select * from ??', [Developer.table])
			.then(rows => rows.map(row => new Developer(row)));
	}

	static findById(id) {
		return db.query('select * from ?? where id = ?', [Developer.table, id])
			.then(rows => {
				if (rows.length === 0) {
					return Promise.resolve(null);
				}
				return new Developer(rows[0]);
			});
	}

	static findByEmail(email) {
		return db.query('select * from ?? where email = ?', [Developer.table, email])
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
			select ${Developer.table}.*
			from ${Developer.table} inner join ${Developer.rel.token} on ${Developer.table}.id = ${Developer.rel.token}.developer_id
			inner join ${Token.table} on ${Developer.rel.token}.token_id = ${Token.table}.id
			where ${Token.table}.tokenVal = ? and ${Developer.table}.password = ?
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
