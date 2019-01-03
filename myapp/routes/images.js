"use strict";

// Load aws sdk
var AWS = require('aws-sdk');
// Create an S3 client
var s3 = new AWS.S3();

// set up router
var express = require('express');
var router = express.Router();

var bucketName = 'geochu-images';

function getImage(req, res, next) {
  var imageName = req.params.imageName;
  var params = {Bucket: bucketName, Key: imageName};
  s3.getObject(params, function(err, data) {
    if(err) {
      next(err);
    }
    else {
      res.imageData = data.Body;
      next();
    }
  });
}

/* GET home page. */
router.get('/:imageName', getImage, function(req, res, next) {
  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': res.imageData.length
  });
  res.end(res.imageData);
});

module.exports = router;