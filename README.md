# Cloud Computing Project

## Description

This project was created for my coursework for the Cloud Computing unit at the University of Bristol. I created a simple website that allows visitors to upload an image that will then appear on the home page of the website. The website is run using various AWS services.

The website is no longer deployed on AWS services as I have closed my account.

## Web Server

The website uses a Node.js web server with the Express web framework. The mustache templating system is used to render the HTML for each page. The multer middleware package is used to upload files to the web server. The AWS Node.js SDK is used in order for the web server to interact with the AWS services.

## AWS Services

The web server is run using Elastic Beanstalk; this results in the web server being automatically horizontally scalable. The images that are uploaded to the website are stored in an S3 bucket. DynamoDB is used as the database to store information about the uploaded images. I make use of CodePipeline in order to achieve continuous delivery: every new commit that is pushed to this GitHub repository triggers the automatic deployment of the latest code.
