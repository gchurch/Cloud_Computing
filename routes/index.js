"use strict";

var os = require("os");
var mustache = require("mustache");
var fs = require("fs");

// set up router
var express = require('express');
var router = express.Router();

var AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-west-2"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
    TableName: "myapp-images",
};

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

function getImageData(req, res, next) {
  docClient.scan(params, onScan);

  function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        res.imagesData = data.Items;

        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
    next();
  }
}

// render the index page template
function renderIndexTemplate(req, res, next) {
  var hostname = os.hostname();
  res.pageContent = mustache.render(res.pageContent, {host: hostname, images: res.imagesData});
  next();
} 

/* GET home page. */
router.get('/', loadIndexTemplate, getImageData, renderIndexTemplate, function(req, res, next) {
  res.render('layout', { stylesheets: [{href: "images.css"}], content: res.pageContent });
});

module.exports = router;
