"use strict";

var os = require("os");
var mustache = require("mustache");
var fs = require("fs");

// set up router
var express = require('express');
var router = express.Router();

// load the index page template
function loadIndexTemplate(req, res, next) {
  fs.readFile("views/index.mustache", "utf8", done);

  //callback function
  function done(err, content) {
  	if(err) throw(err);
  	res.pageContent = content;
  	next();
  }
}

// render the index page template
function renderIndexTemplate(req, res, next) {
  var hostname = os.hostname();
  res.pageContent = mustache.render(res.pageContent, {host: hostname});
  next();
} 

/* GET home page. */
router.get('/', loadIndexTemplate, renderIndexTemplate, function(req, res, next) {
  res.render('layout', { content: res.pageContent });
});

module.exports = router;
