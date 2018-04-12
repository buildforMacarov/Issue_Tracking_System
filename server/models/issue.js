const db = require('../db/database');

const Developer = require('./developer');

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
		return db.query('insert into ?? set ?', [Issue.table, this])
				.then(insertRes => Issue.findById(insertRes.insertId));
	}

	updateStatus(status) {
		return db.query('UPDATE ?? SET status = ? WHERE id = ?', [Issue.table, status, this.id])
			.then(updateRes => Issue.findById(this.id));
	}

	getAssignees() {
		const sql = `
			select ${Developer.table}.* from
			${Issue.table} inner join ${Issue.rel.developer}
			on ${Issue.table}.id = ${Issue.rel.developer}.issue_id
			inner join ${Developer.table}
			on ${Issue.rel.developer}.developer_id = ${Developer.table}.id
			where ${Issue.table}.id = ?
		`;
		return db.query(sql, [this.id])
			.then(rows => rows.map(row => new Developer(row).toPublic()));
	}

	/* STATIC FIELDS */

	static get table() {
		return 'issues';
	}

	static get rel() {
		return {
			developer: 'developer_issue_assignment'
		};
	}

	/* STATIC METHODS */

	static findAll() {
		return db.query('select * from ??', [Issue.table])
			.then(rows => rows.map(row => new Issue(row)));
	}

	static findById(id) {
		return db.query('select * from ?? where id = ?', [Issue.table, id])
			.then(rows => {
				if (rows.length === 0) {
					return Promise.resolve(null);
				}
				return new Issue(rows[0]);
			});
	}
}

module.exports = Issue;
