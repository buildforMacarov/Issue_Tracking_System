const db = require('../db/database');

class Token {
    constructor(config) {
        this.id = config.id;
        this.tokenVal = config.tokenVal;
    }

    /* STATIC FIELDS */

	static get table() {
		return 'login_tokens';
    }
    
    /* STATIC METHODS */

    static insertOne(tokenVal) {
        return db.query('insert into ?? set ?', [Token.table, {
            id: null,
            tokenVal
        }])
        .then(insertRes => {
            const tokenId = insertRes.insertId;
            return new Token({
                id: tokenId,
                tokenVal
            });
        });
    }
}

module.exports = Token;
