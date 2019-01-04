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


//add provided image and info to the database
function addImageToDatabase(req, res, next) {
  //if an image was provided then add an entry to the database
  if(req.file && req.body.image_title.length <= imageTitleMaxLength) {
    //if no title is given then call the image "untitled"
    if(req.body.image_title == "") {
      req.body.image_title = "untitled";
    }

    //code to upload to database

    //callback function
    function done() {
      console.log(res.username + " uploaded an image.");
      res.successfulImageUpload = true;
      next();
    }

    console.log("Adding image to database");
    console.log(req.file);

    next();
  }
  else {
    console.log("Not adding image to database");
    res.successfulImageUpload = false;
    next();
  }
}

//redirect to the appropriate page
function redirect(req, res, next) {
  //redirect to the appropriate page
  if(res.successfulImageUpload) {
    res.redirect('/upload/succeeded');
  } else {
    res.redirect('/upload/failed');
  }
}

//POST request to upload an image
router.post('/post-image', upload.single('image'), addImageToDatabase, redirect);

module.exports = router;
