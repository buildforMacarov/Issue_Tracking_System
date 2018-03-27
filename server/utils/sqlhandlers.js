module.exports.respondWithData = (expressRes) => {
	return (rows) => {
		if (rows.length === 0) {
			expressRes.status(404).send();
		}
		expressRes.json({ rows });
	};
};

module.exports.respondWithError = (expressRes) => {
	return (error) => expressRes.status(400).send();
};
