const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const mongoose = require('mongoose');

chai.use(chaiHttp);

let id1 = '';
let id2 = '';

suite('Functional Tests', function() {
  this.timeout(5000)
	test('1. Create an issue with every field: POST', function(done) {
		chai.request(server)
      .post('api/issues/project')
      .set('content-type', 'application/json')
      .type('form')
      .send({
        issue_title: 'Issue Creation',
        issue_text: 'Create an issue with every field',
        created_by: 'Luzuko',
        assigned_to: 'Khodesa',
        status_text: "Let's see how it goes"
      })
      .end(function(err, res) {
        console.log("Asserting test 1");
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Issue Creation');
        assert.equal(res.body.issue_text, 'Create an issue with every field');
        assert.equal(res.body.created_by, 'Luzuko');
        assert.equal(res.body.assigned_to, 'Khodesa');
        assert.equal(res.body.status_text, "Let's see how it goes");
        done();
      });
	});

	test('2. Create an issue with only required fields: POST', function(done) {
		chai
			.request(server)
			.post('/api/issues/project')
			.type('form')
			.send({
				issue_title: "Issue Creation",
				issue_text: "Create an issue with only required fields.",
				created_by: "Luzuko",
        status_text: "This should be the required field only test"
			})
			.end(function(err, res) {
        console.log("Asserting test 2");
				assert.equal(res.status, 200);
				id1 = res.body._id;
				done();
			});
	});

	test('3. Create an issue with missing required fields: POST', function(done) {
		chai
			.request(server)
			.post('/api/issues/project')
			.type('form')
			.send({
				issue_title: 'Issue Creation',
				issue_text: 'Create an issue with missing required fields.'
			})
			.end(function(err, res) {
				assert.equal(res.status, 200);
				id2 = res.body._id;
				done();
			});
	});

	test('4. View issues on a project: GET', function(done) {
		chai
			.request(server)
			.get('/api/issues/project')
			.end(function(err, res) {
				assert.equal(res.status, 200);
				done();
			});
	});

	test('5. View issues on a project with one filter: GET', function(done) {
		chai
			.request(server)
			.get('/api/issues/project')
			//.type('form')
			.query({ created_by: 'Luzuko' })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				done();
			});
	});

	test('6. View issues on a project with multiple filters: GET', function(done) {
		chai
			.request(server)
			.get('/api/issues/project')
			//.type('form')
			.query({ created_by: 'Luzuko', open: true })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				done();
			});
	});

	test('7. Update one field on an issue: PUT', function(done) {
		chai
			.request(server)
			.put('/api/issues/project')
			.type('form')
			.send({
				_id: id1,
				status_text: 'Status text successfully updated'
			})
			.end(function(err, res) {
				assert.equal(res.status, 200);
				done();
			});
	});

	test('8. Update multiple fields on an issue: PUT', function(done) {
		chai
			.request(server)
			.put('/api/issues/project')
			.type('form')
			.send({
				_id: id2,
				status_text: 'Status text successfully updated again',
				assigned_to: 'Khodesa'
			})
			.end(function(err, res) {
				assert.equal(res.status, 200);
				done();
			});
	});

	test('9. Update an issue with missing _id: PUT', function(done) {
		chai
			.request(server)
			.put('/api/issues/project')
			.type('form')
			.send({
				status_text: 'Status text successfully updated again',
				assigned_to: 'Khodesa'
			})
			.end(function(err, res) {
				assert.equal(res.status, 200);
				done();
			});
	});

	test('10. Update an issue with no fields to update: PUT', function(done) {
		chai
			.request(server)
			.put('/api/issues/project')
			.type('form')
			.send({ _id: id1 })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				done();
			});
	});

	test('11. Update an issue with an invalid _id: PUT', function(done) {
		chai
			.request(server)
			.put('/api/issues/project')
			.type('form')
			.send({
				_id: new mongoose.Types.ObjectId('invalidIdPut'),
				status_text: 'Status text successfully updated'
			})
			.end(function(err, res) {
				assert.equal(res.status, 200);
				done();
			});
	});

	test('12. Delete an issue: DELETE', function(done) {
		chai
			.request(server)
			.delete('/api/issues/project')
			.type('form')
			.send({ _id: id1 })
			.end(function(err, res) {
				assert.equal(res.status, 200);
			});
		chai
			.request(server)
			.delete('/api/issues/project')
			.type('form')
			.send({ _id: id2 })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				done();
			});
	});

	test('13. Delete an issue with an invalid _id: DELETE', function(done) {
		chai
			.request(server)
			.delete('/api/issues/project')
			.type('form')
			.send({ _id: id1 })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				done();
			});
	});

	test('14. Delete an issue with missing _id: DELETE', function(done) {
		chai
			.request(server)
			.delete('/api/issues/project')
			.type('form')
			.send({})
			.end(function(err, res) {
				assert.equal(res.status, 200);
				done();
			});
	});
});