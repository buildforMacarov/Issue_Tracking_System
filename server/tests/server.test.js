const request = require('supertest');
const expect = require('expect');

const { app } = require('./../server');
const db = require('./../db/database');

const User = require('../models/user');
const Issue = require('../models/issue');

/* Place all GET tests BEFORE POSTS/PATCH/DELETE because of NO beforeEach hook */

describe('GET', () => {
	describe('GET /issues', () => {
		/* private to admin */
		it('should return all 3 issues', (done) => {
			request(app)
				.get('/issues')
				.expect(200)
				.expect(res => {
					expect(res.body.issues.length).toBe(3);
					expect(res.body.issues[0]).toIncludeKeys(['id', 'heading', 'description', 'time', 'status']);
				})
				.end(done);
		});
	});
	
	describe('GET /issues/:id', () => {
		/* private to admin */
		it('should return an issue', (done) => {
			request(app)
				.get('/issues/3')
				.expect(200)
				.expect(res => {
					expect(res.body.issue).toIncludeKeys(['id', 'heading', 'description', 'time', 'status']);
					expect(res.body.issue.id).toBeA('number');
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
		/* private to admin */
		it('should return all 3 users', (done) => {
			request(app)
				.get('/users')
				.expect(200)
				.expect(res => {
					expect(res.body.users.length).toBe(3);
					expect(res.body.users[0]).toIncludeKeys(['id', 'name', 'email']);
				})
				.end(done);
		});
	});
	
	describe('GET /users/:id', () => {
		/* private to admin */
		it('should return a user', (done) => {
			request(app)
				.get('/users/2')
				.expect(200)
				.expect(res => {
					expect(res.body.user).toIncludeKeys(['id', 'name', 'email']);
					expect(res.body.user.id).toBeA('number');
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
	
	describe('GET /users/issues', () => {
		/* private to user */
		it('should return all of a user\'s issues', (done) => {
			// get issues of user 2 using token of id 3 of user 2.
			request(app)
				.get('/users/issues')
				.set('x-auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYSQxMiRrcGpxcjR2NjhvMmxWbnJ3R3dqVlBPUy9BcEpGTWlReGpsbmEyclJ0VlNaTTlIMU4xQmRtLiIsImlhdCI6MTUyMzIxMjE2M30.GJxwAC7fRAF9UzQ4AaP3r5bnWG8TPXZgw-jfYx0aaJE')
				.expect(200)
				.expect(res => {
					const issueIds = res.body.issues.map(issue => issue.id);
					expect(res.body.issues.length).toBe(2);
					expect(issueIds).toEqual([1, 3]);
				})
				.end(done);
		});
	
		it('should return 401 if no token in header', (done) => {
			request(app)
				.get('/users/issues')
				.expect(401)
				.end(done);
		});
	
		it('should return 401 if invalid token', (done) => {
			request(app)
				.get('/users/issues')
				.set('x-auth', 'aaabbbccc')
				.expect(401)
				.end(done);
		});
	});
	
	describe('GET /developers', () => {
		/* private to admin */
		it('should return all 4 developers', (done) => {
			request(app)
				.get('/developers')
				.expect(200)
				.expect(res => {
					expect(res.body.developers.length).toBe(4);
					expect(res.body.developers[0]).toIncludeKeys(['id', 'name', 'email']);
				})
				.end(done);
		});
	});
	
	describe('GET /developers/:id', () => {
		/* private to admin */
		it('should return a developer', (done) => {
			request(app)
				.get('/developers/1')
				.expect(200)
				.expect(res => {
					expect(res.body.developer).toIncludeKeys(['id', 'name', 'email']);
					expect(res.body.developer.id).toBeA('number');
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
	
	describe('GET /developers/issues', () => {
		/* private to developer */
		// dev of id = 3, using token of id = 4
		const devThreeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYSQxMiRIWFpQU3c0Q29oUVNKUDlLdnMzYThlNkRCbkowQkF1LnlrMS5JbjlJTy9vUjAva3Noc1RQSyIsImlhdCI6MTUyMzI2MzI4MX0.p-jmoRcn8DlQxs3ERFNXHdKE_g_cMOuQg0LcOKptmvA';
		it('should return all of a developer\'s assigned issues', (done) => {
			request(app)
				.get('/developers/issues')
				.set('x-auth', devThreeToken)
				.expect(200)
				.expect(res => {
					const issueIds = res.body.issues.map(issue => issue.id);
					expect(res.body.issues.length).toBe(2);
					expect(issueIds).toEqual([1, 2]);
				})
				.end(done);
		});

		it('should return 401 if no token in header', (done) => {
			request(app)
				.get('/developers/issues')
				.expect(401)
				.end(done);
		});

		it('should return 401 if invalid token', (done) => {
			request(app)
				.get('/developers/issues')
				.set('x-auth', 'aaabbbccc')
				.expect(401)
				.end(done);
		});
	});
	
	describe('GET /admins', () => {
		/* private to admin */
		it('should return all 2 admins', (done) => {
			request(app)
				.get('/admins')
				.expect(200)
				.expect(res => {
					expect(res.body.admins.length).toBe(2);
					expect(res.body.admins[0]).toIncludeKeys(['id', 'name', 'email']);
				})
				.end(done);
		});
	});
	
	describe('GET /admins/:id', () => {
		/* private to admin */
		it('should return an admin', (done) => {
			request(app)
				.get('/admins/1')
				.expect(200)
				.expect(res => {
					expect(res.body.admin).toIncludeKeys(['id', 'name', 'email']);
					expect(res.body.admin.id).toBeA('number');
				})
				.end(done);
		});
	
		it('should return 404 if id invalid', (done) => {
			request(app)
				.get('/admins/abc')
				.expect(404)
				.end(done);
		});
	
		it('should return 404 if id not found', (done) => {
			request(app)
				.get('/admins/9999')
				.expect(404)
				.end(done);
		});
	});
});

describe('POST', () => {
	describe('POST users/issues', () => {
		/* private to user */
		const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYSQxMiR4eDJuUDZBZVhlV1FzVllXWDYxSVh1N0FWOTc5dkpkOUd3ODFzR0c3aWZSLzU5TE9VODRYMiIsImlhdCI6MTUyMzIxMjA3MH0.zIDcd1ZlMaa3EVIntRMuWxYQ_8REbrJpEHPMAJWAdEw';
	
		it('should post an issue and update which user posted it', (done) => {
			// post issue for user 1 using token of id 1 of user 1.
			const userId = 1;
			const heading = 'Testing issue post';
			const description = 'This is a POST /issues test that is valid';
	
			request(app)
				.post(`/users/issues`)
				.send({ heading, description })
				.set('x-auth', userToken)
				.expect(200)
				.expect(res => {
					// client test
					expect(res.body.issue).toIncludeKeys(['id', 'heading', 'description', 'time', 'status']);
					expect(res.body.issue).toInclude({ heading, description, status: 'open' });
				})
				.end((err, res) => {
					// server test
					if (err) return done(err);
	
					const issueRes = res.body.issue;
	
					db.query('SELECT * FROM issues')
						.then(rows => {
							expect(rows.length).toBe(4);
							return db.query('SELECT * FROM issues WHERE id = ?', [issueRes.id]);
						})
						.then(rows => {
							const postedIssue = rows[0];
							expect(postedIssue).toInclude({ heading, description, status: 'open' });
							return db.query('select * from user_issue_open where user_id = ? and issue_id = ?', [userId, issueRes.id]);
						})
						.then(rows => {
							const postedRel = rows[0];
							expect(postedRel).toInclude({
								user_id: userId,
								issue_id: issueRes.id
							});
							done();
						})
						.catch(done);
				});
		});
	
		it('should return 400 if issue has no heading', (done) => {
			// post issue for user 1 using token of id 1 of user 1.
			request(app)
				.post('/users/issues')
				.set('x-auth', userToken)
				.send({
					description: 'This issue doesn\'t have a heading'
				})
				.expect(400)
				.end(done);
		});
	
		it('should return 401 if invalid token', (done) => {
			request(app)
				.post('/users/issues')
				.set('x-auth', 'aaabbbccc')
				.send({
					heading: 'Foo',
					description: 'yay'
				})
				.expect(401)
				.end(done);
		});
	
		it('should return 401 if no token', (done) => {
			request(app)
				.post('/users/issues')
				.send({
					heading: 'This is a heading',
					description: 'This issue is sent without a token'
				})
				.expect(401)
				.end(done);
		});
	});
	
	describe('POST /assignment', () => {
		/* private to admin */
		it('should assign an issue to a developer', (done) => {
			const adminId = 2;
			const developerId = 1;
			const issueId = 3;
			request(app)
				.post('/assignment')
				.send({ adminId, developerId, issueId })
				.expect(200)
				.end((err, res) => {
					if (err) {
						return done(err);
					}
					request(app)
						.get(`/developers/${developerId}/issues`)
						.expect(200)
						.expect(res => {
							const issueIds = res.body.issues.map(issue => issue.id);
							expect(res.body.issues.length).toBe(2);
							expect(issueIds).toEqual([1, issueId]);
						})
						.end(done);
				});
		});
	
		it('should not assign an issue to a developer if already assigned to him', (done) => {
			const adminId = 2;
			const developerId = 1;
			const issueId = 1;
			request(app)
				.post('/assignment')
				.send({ adminId, developerId, issueId })
				.expect(400)
				.end(done)
		});
	
		it('should not assign a non-existent issue to a developer', (done) => {
			const adminId = 2;
			const developerId = 1;
			const issueId = 999;
			request(app)
				.post('/assignment')
				.send({ adminId, developerId, issueId })
				.expect(400)
				.end((err, res) => {
					if (err) {
						return done(err);
					}
	
					const sql = 'select * from developer_issue_assignment where developer_id = ? and issue_id = ?';
					db.query(sql, [developerId, issueId])
						.then(rows => {
							expect(rows.length).toBe(0);
							done();
						})
						.catch(done);
				});
		});
	
		it('should not assign an issue to a non-existent developer', (done) => {
			const adminId = 2;
			const developerId = 999;
			const issueId = 1;
			request(app)
				.post('/assignment')
				.send({ adminId, developerId, issueId })
				.expect(400)
				.end((err, res) => {
					if (err) {
						return done(err);
					}
	
					const sql = 'select * from developer_issue_assignment where developer_id = ? and issue_id = ?';
					db.query(sql, [developerId, issueId])
						.then(rows => {
							expect(rows.length).toBe(0);
							done();
						})
						.catch(done);
				});
		});
	});
	
	describe('POST /users/login', () => {
		it('should log in a user', (done) => {
			// user 1 already has one token
			const user = {
				id: 1,
				name: 'Zenkov',
				email: 'tenkov@gmail.com',
				password: 'mansnothot1432!',
			};
			request(app)
				.post('/users/login')
				.send({
					email: user.email,
					password: user.password
				})
				.expect(200)
				.expect(res => {
					expect(res.headers['x-auth']).toExist();
					expect(res.body.user).toIncludeKeys(['id', 'name', 'email']);
				})
				.end((err, res) => {
					if (err) {
						return done(err);
					}
	
					User.findById(user.id)
						.then(user => {
							if (!user) {
								return Promise.reject({ message: `No user with id of ${user.id} ?!?!` });
							}
							return user.findAllTokens();
						})
						.then(tokens => {
							expect(tokens.length).toBe(2);
							expect(tokens[1].tokenVal).toBe(res.headers['x-auth']);
							done();
						})
						.catch(done);
				});
		});
	
		it('should not log in a user if unregistered email', (done) => {
			const email = 'unregisteredemail@email.co';
			const password = 'mansnothot1432!';
	
			request(app)
				.post('/users/login')
				.send({ email, password })
				.expect(404)
				.end(done);
		});
	
		it('should not log in a user if invalid password', (done) => {
			const user = {
				id: 3,
				name: 'Dreskonivich',
				email: 'dreskonmail@hotmail.com',
				password: 'ilikespaceM00n-wrongpassword'
			};
			request(app)
				.post('/users/login')
				.send({
					email: user.email,
					password: user.password
				})
				.expect(404)
				.end((err, res) => {
					if (err) {
						return done(err);
					}
	
					User.findById(user.id)
						.then(user => {
							if (!user) {
								return Promise.reject({ message: `No user with id of ${user.id} ?!?!` });
							}
							return user.findAllTokens();
						})
						.then(tokens => {
							expect(tokens.length).toBe(0);
							done();
						})
						.catch(done);
				});
		});
	});
	
	describe('POST /users/signup', () => {
		it('should sign up (insert) a user', (done) => {
			const name = 'NewUser123';
			const email = 'newuseremail@email.com';
			const password = 'newUserPassw0rd';
	
			request(app)
				.post('/users/signup')
				.send({ name, email, password })
				.expect(200)
				.expect(res => {
					expect(res.headers['x-auth']).toExist();
					expect(res.body.user).toIncludeKeys(['id', 'name', 'email']);
					expect(res.body.user).toInclude({ name, email });
				})
				.end((err, res) => {
					if (err) {
						return done(err);
					}
					User.findById(res.body.user.id)
						.then(user => {
							if (!user) {
								return Promise.reject();
							}
							expect(user).toInclude(res.body.user);
							done();
						})
						.catch(done);
				});
		});
	
		it('should not sign up a user if email is taken', (done) => {
			const name = 'NewUser123';
			const email = 'tenkov@gmail.com';  // user id = 1's email
			const password = 'newUserPassw0rd';
	
			request(app)
				.post('/users/signup')
				.send({ name, email, password })
				.expect(400)
				.end(done);
		});
	});
});

describe('PATCH', () => {
	describe('PATCH /users/issues/:id', () => {
		/* private to user */
		// token of id = 2, of user id = 2
		const userTwoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYSQxMiRrcGpxcjR2NjhvMmxWbnJ3R3dqVlBPUy9BcEpGTWlReGpsbmEyclJ0VlNaTTlIMU4xQmRtLiIsImlhdCI6MTUyMzIxMjEzNn0.-OfyeL1y8ONTKiVpLFybxNnPVPGmWV4Xx1X7s75yflM';
		it('should close a user\'s issue', (done) => {
			const issueId = 3;
			request(app)
				.patch(`/users/issues/${issueId}`)
				.set('x-auth', userTwoToken)
				.send({ status: 'closed '})
				.expect(200)
				.expect(res => {
					expect(res.body.issue.status).toBe('closed');
				})
				.end((err, res) => {
					if (err) return done(err);
	
					Issue.findById(issueId)
						.then(issue => {
							expect(issue.status).toBe('closed');
							done();
						})
						.catch(done);
				});
		});
	
		it('should not close an issue created by other users', (done) => {
			const issueId = 2;
			request(app)
				.patch(`/users/issues/${issueId}`)
				.set('x-auth', userTwoToken)
				.send({ status: 'closed' })
				.expect(404)
				.end(err => {
					if (err) return done(err);
	
					Issue.findById(issueId)
						.then(issue => {
							expect(issue.status).toBe('open');
							done();
						})
						.catch(done);
				});
		});
	});
});
