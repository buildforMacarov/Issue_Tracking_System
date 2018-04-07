const bcrypt = require('bcrypt');

const db = require('../db/database');

class Admin {
	constructor(config) {
		this.id = config.id;
		this.name = config.name;
		this.email = config.email;
		this.password = config.password;
	}

	/* INSTANCE METHODS */


	/* STATIC FIELDS */

	static get table() {
		return 'admins';
	}

	static get rel() {
		return {};
	}

	/* STATIC METHODS */

	static findAll() {
		return db.query('select * from ??', [Admin.table]);
	}

	static findById(id) {
		return db.query('select * from ?? where id = ?', [Admin.table, id])
			.then(admins => {
				if (admins.length === 0) {
					return Promise.resolve(null);
				}
				return new Admin(admins[0]);
			});
	}

	static findByEmail(email) {
		return db.query('select * from ?? where email = ?', [Admin.table, email])
			.then(admins => {
				if (admins.length === 0) {
					return Promise.resolve(null);
				}
				return new Admin(admins[0]);
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
}

module.exports = Admin;
