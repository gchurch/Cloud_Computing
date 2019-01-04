"use strict"

const express = require("express");
const router = express.Router();
const fs = require("fs");
const mustache = require("mustache");

const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

const imageTitleMaxLength = 30;

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
  res.pageContent = mustache.render(res.pageContent, {imageTitleMaxLength: imageTitleMaxLength});
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
  if(req.file && req.body.image_title.length <= imageTitleMaxLength) {
    //if no title is given then call the image "untitled"
    if(req.body.image_title == "") {
      req.body.image_title = "untitled";
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
    done();

    //callback function
    function done() {
      console.log("Uploaded image.");
      res.uploaded = true;
      next();
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
    done();

    //callback function
    function done() {
      console.log("Added database entry.");
      res.addedEntry = true;
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
