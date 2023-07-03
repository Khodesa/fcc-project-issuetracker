'use strict';

const expect = require('chai').expect;
const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');

module.exports = function(app, myDataBase) {
	mongoose.connect(
		process.env.MONGO_URI,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	);

	let issueSchema = new mongoose.Schema({
		issue_title: { type: String, required: true },
		issue_text: { type: String, required: true },
		created_by: { type: String, required: true },
		assigned_to: { type:  String, default: "" },
		status_text: { type:  String, default: "" },
		open: { type: Boolean, required: true },
		created_on: { type: Date, required: true },
		updated_on: { type: Date, required: true },
		project: String
	});

	let Issue = mongoose.model('Issue', issueSchema);

	app
		.route('/api/issues/:project')

		.get(async function(req, res) {
      console.log("Getting Issues");
			let project = req.params.project;

			let objFilter = Object.assign(req.query);
			objFilter['project'] = project;

      let issues = await Issue.find(objFilter);
      if (issues){
        return res.json(issues);
      }
		})

		.post(async function(req, res, next) {
      console.log("Posting Issues");
			let project = req.params.project;
			// required
			let issue_title = req.body.issue_title;
			let issue_text = req.body.issue_text;
			let created_by = req.body.created_by;
			// optional
			let assigned_to = req.body.assigned_to;
			let status_text = req.body.status_text;

      if(!!issue_title && !!issue_text && !!created_by && !!assigned_to && !!status_text){
        console.log("All fields filled");
      }

			if (!issue_title || !issue_text || !created_by) {
        console.log( "{ error: 'required field(s) missing' }" );
				return res.json({ error: 'required field(s) missing' });
			} else {
				let newIssue = new Issue({
					issue_title: issue_title,
					issue_text: issue_text,
					created_by: created_by,
					assigned_to: assigned_to,
					status_text: status_text,
					open: true,
					created_on: new Date(),
					updated_on: new Date(),
					project: project
				});

				let savedIssue = await newIssue.save();
        console.log("Saved Issue: " + savedIssue);
				return res.json(savedIssue);
      }
		})
		.put(async function(req, res) {
      console.log("Updating Issues");
			let project = req.params.project;
			let _id = req.body._id;
			let issue_title = req.body.issue_title; //
			let issue_text = req.body.issue_text; //
			let created_by = req.body.created_by; //
			let assigned_to = req.body.assigned_to;
			let status_text = req.body.status_text;
      let open = req.body.open //== 'false') ? false : true 

			if (!_id) {
				return res.json({ error: 'missing _id' });
			}

			if (
				!issue_title &&
				!issue_text &&
				!created_by &&
				!assigned_to &&
				!status_text &&
        !open
			) {
				return res.json({ error: 'no update field(s) sent', '_id': _id });
			}

			var updateObj = {};

			for (var key in req.body) {
				if (key != '_id' && req.body[key] != '') {
					updateObj[key] = req.body[key];
				}
			}

			updateObj['updated_on'] = new Date();

			let updatedIssue = await Issue.findByIdAndUpdate(
				_id,
				updateObj,
				{ new: true }
			);

      if(updatedIssue){
            return res.json({  result: 'successfully updated', '_id': _id })
          }else if(!updatedIssue){
            return res.json({ error: 'could not update', '_id': _id })
          }
		})

		.delete(async function(req, res) {
      console.log("Deleting Issue");
			let project = req.params.project;
			let _id = req.body._id;

			if (!_id) {
				return res.json({ error: 'missing _id' });
			}

      let deletedIssue = await Issue.findByIdAndRemove(_id);
      if(deletedIssue){
          return res.json({ result: 'successfully deleted', '_id': _id });
        }else if(!deletedIssue){
          return res.json({ error: 'could not delete', '_id': _id });
        }
		});
};
