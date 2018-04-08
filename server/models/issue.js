const db = require('../db/database');

class Issue {
	constructor(config) {
		this.id = config.id || null;
		this.heading = config.heading;
		this.description = config.description;
		this.time = config.time;
		this.status = config.status;
	}

	/* STATIC FIELDS */

	static get table() {
		return 'issues';
	}

	/* STATIC METHODS */

	static findAll() {
		return db.query('select * from ??', [Issue.table]);
	}

	static findById(id) {
		return db.query('select * from ?? where id = ?', [Issue.table, id])
			.then(issues => {
				if (issues.length === 0) {
					return Promise.resolve(null);
				}
				return new Issue(issues[0]);
			});
	}
}

module.exports = Issue;
