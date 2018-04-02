const request = require('supertest');
const expect = require('expect');

const { app, db } = require('./../server');

describe('GET /issues', () => {
	it('should return all 13 issues', (done) => {
		request(app)
			.get('/issues')
			.expect(200)
			.expect(res => {
				expect(res.body.rows.length).toBe(13);
				expect(res.body.rows[0]).toIncludeKeys(['id', 'heading', 'description', 'time', 'status']);
			})
			.end(done);
	});
});

describe('GET /issues/:id', () => {
	it('should return an issue', (done) => {
		request(app)
			.get('/issues/3')
			.expect(200)
			.expect(res => {
				const issue = res.body.rows[0];
				expect(issue).toIncludeKeys(['id', 'heading', 'description', 'time', 'status']);
				expect(issue.id).toBeA('number');
			})
			.end(done);
	});

	it('should return 404 if id invalid', (done) => {
		request(app)
			.get('/issues/abc')
			.expect(404)
			.end(done);
	});

	it('should return 404 if id not found', (done) => {
		request(app)
			.get('/issues/9999')
			.expect(404)
			.end(done);
	});
});

describe('GET /users', () => {
	it('should return all 8 users', (done) => {
		request(app)
			.get('/users')
			.expect(200)
			.expect(res => {
				expect(res.body.rows.length).toBe(8);
				expect(res.body.rows[0]).toIncludeKeys(['id', 'name', 'email']);
			})
			.end(done);
	});
});

describe('GET /users/:id', () => {
	it('should return a user', (done) => {
		request(app)
			.get('/users/5')
			.expect(200)
			.expect(res => {
				const user = res.body.rows[0];
				expect(user).toIncludeKeys(['id', 'name', 'email']);
				expect(user.id).toBeA('number');
			})
			.end(done);
	});

	it('should return 404 if id invalid', (done) => {
		request(app)
			.get('/users/abc')
			.expect(404)
			.end(done);
	});

	it('should return 404 if id not found', (done) => {
		request(app)
			.get('/users/9999')
			.expect(404)
			.end(done);
	});
});

describe('GET /users/:userId/issues', () => {
	it('should return all of a user\'s issues', (done) => {
		request(app)
			.get('/users/3/issues')
			.expect(200)
			.expect(res => {
				const issueIds = res.body.rows.map(issue => issue.id);
				expect(res.body.rows.length).toBe(3);
				expect(issueIds).toEqual([2, 3, 7]);
			})
			.end(done);
	});

	it('should return 404 if userId invalid', (done) => {
		request(app)
			.get('/users/abc/issues')
			.expect(404)
			.end(done);
	});

	it('should return 404 if userId not found', (done) => {
		request(app)
			.get('/users/9999/issues')
			.expect(404)
			.end(done);
	});
});

describe('GET /developers', () => {
	it('should return all 6 developers', (done) => {
		request(app)
			.get('/developers')
			.expect(200)
			.expect(res => {
				expect(res.body.rows.length).toBe(6);
				expect(res.body.rows[0]).toIncludeKeys(['id', 'name', 'email']);
			})
			.end(done);
	});
});

describe('GET /developers/:id', () => {
	it('should return a developer', (done) => {
		request(app)
			.get('/developers/5')
			.expect(200)
			.expect(res => {
				const dev = res.body.rows[0];
				expect(dev).toIncludeKeys(['id', 'name', 'email']);
				expect(dev.id).toBeA('number');
			})
			.end(done);
	});

	it('should return 404 if id invalid', (done) => {
		request(app)
			.get('/developers/abc')
			.expect(404)
			.end(done);
	});

	it('should return 404 if id not found', (done) => {
		request(app)
			.get('/developers/9999')
			.expect(404)
			.end(done);
	});
});

describe('GET /developers/:developerId/issues', () => {
	it('should return all of a developer\'s issues', (done) => {
		request(app)
			.get('/developers/3/issues')
			.expect(200)
			.expect(res => {
				const issues = res.body.rows;
				const issueIds = issues.map(issue => issue.id);
				expect(issues.length).toBe(2);
				expect(issueIds).toEqual([8, 9]);
			})
			.end(done);
	});

	it('should return 404 if developerId invalid', (done) => {
		request(app)
			.get('/developers/abc/issues')
			.expect(404)
			.end(done);
	});

	it('should return 404 if developerId not found', (done) => {
		request(app)
			.get('/developers/9999/issues')
			.expect(404)
			.end(done);
	});
});

describe('POST /issues/:userId', () => {
	it('should post an issue and update which user posted it', (done) => {
		const userId = 8;
		const heading = 'Testing issue post';
		const description = 'This is a POST /issues test that is valid';

		request(app)
			.post(`/issues/${userId}`)
			.send({ heading, description })
			.expect(200)
			.expect(res => {
				// client test
				expect(res.body).toIncludeKeys(['user', 'issue']);
				expect(res.body.user).toIncludeKeys(['id', 'name', 'email']);
				expect(res.body.issue).toIncludeKeys(['id', 'heading', 'description', 'time', 'status']);

				expect(res.body.user.id).toBe(userId);
				expect(res.body.issue).toInclude({ heading, description, status: 'open' });
			})
			.end((err, res) => {
				// server test
				if (err) return done(err);

				const userRes = res.body.user;
				const issueRes = res.body.issue;

				db.query('SELECT * FROM issues WHERE id = ?', [issueRes.id])
					.then(rows => {
						const postedIssue = rows[0];
						expect(postedIssue).toInclude({ heading, description, status: 'open' });
						return db.query('select * from user_issues where user_id = ? and issue_id = ?', [userRes.id, issueRes.id]);
					})
					.then(rows => {
						const postedRel = rows[0];
						expect(postedRel).toInclude({
							user_id: userRes.id,
							issue_id: issueRes.id
						});
						done();
					})
					.catch(done);
			});
	});

	it('should not post an issue if user doesn\'t exist', (done) => {
		request(app)
			.post('/issues/9999')
			.send({
				heading: 'Foo',
				description: 'yay'
			})
			.expect(400)
			.end(done);
	});

	it('should not post an issue if no heading', (done) => {
		request(app)
			.post('/issues/8')
			.send({
				description: 'This issue doesn\'t have a heading'
			})
			.expect(400)
			.end(done);
	});
});
