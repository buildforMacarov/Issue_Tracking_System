const db = require('../db/database');

class User {
	static get tableName() {
		return 'users';
	}

	static findAll() {
		return db.query('select id, name, email from ??', [User.tableName]);
	}
}

module.exports = User;
