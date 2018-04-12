const db = require('../db/database');

const tables = require('../db/tables.json');
const { ISSUE } = tables.entities;

class Issue {
	constructor(config) {
		this.id = config.id || null;
		this.heading = config.heading;
		this.description = config.description;
		this.time = config.time || null;
		this.status = config.status || 'open';
	}

	/* INSTANCE METHODS */

	save() {
		return db.query('insert into ?? set ?', [ISSUE, this])
				.then(insertRes => Issue.findById(insertRes.insertId));
	}

	updateStatus(status) {
		return db.query('UPDATE ?? SET status = ? WHERE id = ?', [ISSUE, status, this.id])
			.then(updateRes => Issue.findById(this.id));
	}

	/* STATIC FIELDS */

	/* STATIC METHODS */

	static findAll() {
		return db.query('select * from ??', [ISSUE])
			.then(rows => rows.map(row => new Issue(row)));
	}

	static findById(id) {
		return db.query('select * from ?? where id = ?', [ISSUE, id])
			.then(rows => {
				if (rows.length === 0) {
					return Promise.resolve(null);
				}
				return new Issue(rows[0]);
			});
	}
}

module.exports = Issue;
