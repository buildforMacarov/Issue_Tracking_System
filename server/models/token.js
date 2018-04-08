const db = require('../db/database');

class Token {
    constructor(config) {
        this.id = config.id || null;
        this.tokenVal = config.tokenVal;
    }

    /* INSTANCE METHODS */
    save() {
        return db.query('insert into ?? set ?', [Token.table, this])
            .then(insertRes => Token.findById(insertRes.insertId));
    }

    /* STATIC FIELDS */

	static get table() {
		return 'login_tokens';
    }
    
    /* STATIC METHODS */

    static findById(id) {
		return db.query('select * from ?? where id = ?', [Token.table, id])
			.then(rows => {
				if (rows.length === 0) {
					return Promise.resolve(null);
				}
				return new Token(rows[0]);
			});
	}
}

module.exports = Token;
