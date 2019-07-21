# COMSM0010 Cloud Computing Project

I created a simple website that allows visitors to upload an image that will then appear on the home page of the website. The website uses a Node.js web server with the Express web framework. The website is run on AWS. The web server is run using Elastic Beanstalk; this results in the web server being automatically horizontally scalable. The images that are uploaded to the website are stored in an S3 bucket. DynamoDB is used to store information about the uploaded images. I make use of CodePipeline in order to achieve continuous delivery: every new commit that is pushed to this GitHub repository triggers the automatic deployment of the latest code.

The website can be found at the following address: http://shareimages-env.ptfpgb7h3w.eu-west-2.elasticbeanstalk.com/
