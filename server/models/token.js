const db = require('../db/database');

const tables = require('../db/tables.json');
const { TOKEN } = tables.entities;

class Token {
    constructor(config) {
        this.id = config.id || null;
        this.tokenVal = config.tokenVal;
    }

    /* INSTANCE METHODS */
    save() {
        return db.query('insert into ?? set ?', [TOKEN, this])
            .then(insertRes => Token.findById(insertRes.insertId));
    }

    /* STATIC FIELDS */
    
    /* STATIC METHODS */

    static findById(id) {
		return db.query('select * from ?? where id = ?', [TOKEN, id])
			.then(rows => {
				if (rows.length === 0) {
					return Promise.resolve(null);
				}
				return new Token(rows[0]);
			});
	}
}

module.exports = Token;
