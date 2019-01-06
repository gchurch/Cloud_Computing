"use strict"

// Load aws sdk
var AWS = require('aws-sdk');

AWS.config.update({
  region: "eu-west-2"
})

var docClient = new AWS.DynamoDB.DocumentClient();

var tableName = "myapp-images";

// Create an S3 client
var s3 = new AWS.S3();
// Name of the bucket to store the uploaded image
var bucketName = 'myapp-image-storage';

const express = require("express");
const router = express.Router();
const fs = require("fs");
const mustache = require("mustache");

const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

const imageTitleMaxLength = 30;
const authorMaxLength = 20;

//load the index page content
function loadUploadTemplate(req, res, next) {
	fs.readFile("views/upload.mustache", "utf8", done);
  
  //callback function
  function done(err, content) {
    if(err) throw(err);
    res.pageContent = content;
    next();
  }
}

//load the upload fail page template
function loadUploadFailedTemplate(req, res, next) {
	fs.readFile("views/upload-failed.mustache", "utf8", done);

  //callback function
	function done(err, content) {
		if(err) throw(err);
		res.pageContent = content;
		next();
	}
}

//load the upload succeeded page template
function loadUploadSucceededTemplate(req, res, next) {
  fs.readFile("views/upload-succeeded.mustache", "utf8", done);

  //callback function
  function done(err, content) {
    if(err) throw(err);
    res.pageContent = content;
    next();
  }
}

function renderUploadTemplate(req, res, next) {
  res.pageContent = mustache.render(res.pageContent, {imageTitleMaxLength: imageTitleMaxLength, authorMaxLength: authorMaxLength});
  next();
}

//GET requests for upload pages
var stylesheets = [{href: "upload.css"}];
var scripts = [];
router.get('/', loadUploadTemplate, renderUploadTemplate, function(req, res, next) {
  res.render('layout', {stylesheets: stylesheets, scripts: scripts, content: res.pageContent});
});
router.get('/failed', loadUploadFailedTemplate, function(req, res, next) {
  res.render('layout', {stylesheets: stylesheets, scripts: scripts, content: res.pageContent});
});

router.get('/succeeded', loadUploadSucceededTemplate, function(req, res, next) {
  res.render('layout', {stylesheets: stylesheets, scripts: scripts, content: res.pageContent});
});


function checkData(req, res, next) {
  if(req.file && req.body.image_title.length <= imageTitleMaxLength && req.body.author.length <= authorMaxLength) {
    //if no title is given then call the image "untitled"
    if(req.body.image_title == "") {
      req.body.image_title = "untitled";
    }
    if(req.body.author == "") {
      req.body.author = "anonymous";
    }
    res.canUpload = true;
    console.log("Can upload image.");
  }
  else {
    res.canUpload = false;
    console.log("Can't upload image.");
  }
  next();
}


function uploadImageToBucket(req, res, next) {
  if(res.canUpload) {

    //code to upload image to S3 bucket
    var params = {
      Body: req.file.buffer,
      Bucket: bucketName,
      Key: req.file.originalname
    }
    s3.putObject(params, done);

    //callback function
    function done(err, data) {
      if(err) {
        console.log(err);
        next(err);
      } else {
        console.log("Uploaded image.");
        res.uploaded = true;
        next();
      }
    }
  }
  else {
    res.uploaded = false;
    console.log("Didn't upload image.");
    next();
  }
}

function addEntryToDatabase(req, res, next) {
  if(res.canUpload && res.uploaded) {

    //code to add entry to database
    var params = {
      TableName:tableName,
      Item:{
        "author": req.body.author,
        "title": req.body.image_title,
        "info":{
            "url": req.file.originalname,
            "description": "."
        }
      }
    };
    docClient.put(params, done);

    //callback function
    function done(err, data) {
      if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("Added database entry.");
        res.addedEntry = true;
      }
      next();
    }

  }
  else {
    res.addedEntry = false;
    console.log("Didn't add entry to database.");
    next();
  }
}

//redirect to the appropriate page
function redirect(req, res, next) {
  //redirect to the appropriate page
  if(res.uploaded && res.addedEntry) {
    res.redirect('/upload/succeeded');
  } else {
    res.redirect('/upload/failed');
  }
}

//POST request to upload an image
router.post('/post-image', upload.single('image'), checkData, uploadImageToBucket, addEntryToDatabase, redirect);

module.exports = router;
