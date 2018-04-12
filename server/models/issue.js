const db = require('../db/database');

const tables = require('../db/tables.json');
const { ISSUE, DEVELOPER } = tables.entities;
const { DEV_ISSUE } = tables.relationships;

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

	getAssignees() {
		const sql = `
			select ${DEVELOPER}.* from
			${ISSUE} inner join ${DEV_ISSUE}
			on ${ISSUE}.id = ${DEV_ISSUE}.issue_id
			inner join ${DEVELOPER}
			on ${DEV_ISSUE}.developer_id = ${DEVELOPER}.id
			where ${ISSUE}.id = ?
		`;
		return db.query(sql, [this.id])
			.then(rows => {
				return rows.map(row => {
					return {
						id: row.id,
						name: row.name,
						email: row.email
					};
				});
			});
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
