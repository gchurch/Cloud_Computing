# Cloud Computing Project

## Description

This project was created for my coursework for the Cloud Computing unit at the University of Bristol. In this project I created a website that runs on various AWS services that is automatically scalable. The website that I created simply allows visitors to upload an image that will then appear on the home page of the website.

The website is no longer deployed on AWS services as I have closed my account.

## Web Server

The website uses a Node.js web server with the Express web framework. The AWS Node.js SDK is used in order for the web server to interact with the AWS services.

## AWS Services

The web server is run using Elastic Beanstalk; this results in the web server being automatically horizontally scalable. The web server is run behind a load balancer and additional versions of the web server are spun up if the CPU usage reaches a certain threshold. The images that are uploaded to the website are stored in an S3 bucket. S3 buckets automatically scale to hold as many images as you need. DynamoDB is used as the database to store information about the uploaded images. DynamoDB is a scalable NoSQL database.
