var AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-west-2"
});

// empty S3 bucket
var s3 = new AWS.S3();
var bucketName = 'myapp-image-storage';
emptyBucket();

// empty dynamoDB table
var docClient = new AWS.DynamoDB.DocumentClient();
var tableName = "myapp-images";
var scanParams = {
    TableName: tableName,
};
emptyTable();


function emptyBucket() {
    s3.listObjects({Bucket: bucketName}, function (err, data) {
        if (err) {
            console.log("error listing bucket objects "+err);
            return;
        }
        var items = data.Contents;
        for (var i = 0; i < items.length; i += 1) {
            var deleteParams = {Bucket: bucketName, Key: items[i].Key};
            s3.deleteObject(deleteParams, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("deleted an image");
                }
            });
        }
    });
}

function emptyTable() {
    docClient.scan(scanParams, function(err, data) {
        if (err) console.log(err); // an error occurred
        else {
            data.Items.forEach(function(obj,i){
                var params = {
                    TableName: tableName,
                    Key: {
                        "author": obj.author,
                        "title": obj.title
                    },
                    ReturnValues: 'NONE', // optional (NONE | ALL_OLD)
                    ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
                    ReturnItemCollectionMetrics: 'NONE', // optional (NONE | SIZE)
                };
    
                docClient.delete(params, function(err, data) {
                    if (err) console.log(err); // an error occurred
                    else console.log("deleted entry"); // successful response
                });     
            });
        }
    });
}