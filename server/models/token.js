const db = require('../db/database');

class Token {
    constructor(config) {
        this.id = config.id || null;
        this.tokenVal = config.tokenVal;
    }

    /* INSTANCE METHODS */
    save() {
        return db.query('insert into ?? set ?', [Token.table, this])
            .then(insertRes => {
                this.id = insertRes.insertId;
                return this;
            });
    }

    /* STATIC FIELDS */

	static get table() {
		return 'login_tokens';
    }
    
    /* STATIC METHODS */

}

module.exports = Token;
