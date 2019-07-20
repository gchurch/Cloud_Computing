"use strict"

const mime = require('mime');
var fs = require("fs");

// Load aws sdk
var AWS = require('aws-sdk');

AWS.config.update({
  region: "eu-west-2"
})

// Create an S3 client
var s3 = new AWS.S3();
// Name of the bucket to store the uploaded image
var bucketName = 'myapp-image-storage';

uploadFavicons();

function uploadFavicons() {
	uploadFavicon("favicon/favicon16x16.png");
	uploadFavicon("favicon/favicon32x32.png");
	uploadFavicon("favicon/favicon96x96.png");
}


function uploadFavicon(filename) {
  loadFavicon(filename, done);

  function done(file) {
  	uploadImageToBucket(file, filename);
  }
}


function loadFavicon(filename, callback) {
  fs.readFile(filename, done);

  function done(err, file) {
  	if(err) throw err;
  	callback(file);
  }
}


function uploadImageToBucket(file, filename) {
  //code to upload image to S3 bucket
  var params = {
    Body: file,
    Bucket: bucketName,
    Key: filename,
    ContentType: mime.getType(filename)
  }
  s3.putObject(params, done);

  //callback function
  function done(err, data) {
    if(err) {
      console.log(err);
    } else {
      console.log("Uploaded image.");
    }
  }
}