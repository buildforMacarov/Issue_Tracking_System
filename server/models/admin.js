const bcrypt = require('bcrypt');

const db = require('../db/database');

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
			issue: 'developer_issue_assignment'
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
}

module.exports = Admin;
