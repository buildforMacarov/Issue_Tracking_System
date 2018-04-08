const jwt = require('jsonwebtoken');

const { db } = require('./../server');

const authenticateUser = (req, res, next) => {
	const token = req.header('x-auth');
	let decoded;
	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch (error) {
		return res.status(401).send();
	}

	const sql = `
		select users.id, users.name, users.email
		from users inner join user_tokens on users.id = user_tokens.user_id
		inner join login_tokens on user_tokens.token_id = login_tokens.id
		where login_tokens.token = ? and users.id = ? and users.email = ? and users.password = ?;
	`;
	db.query(sql, [token, decoded.id, decoded.email, decoded.password])
		.then(rows => {
			if (rows.length === 0) {
				return Promise.reject();
			}
			req.user = rows[0];
			req.token = token;
			next();
		})
		.catch(() => res.status(401).send());
};

module.exports = { authenticateUser };
