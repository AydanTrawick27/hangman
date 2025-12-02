// api/dynamoClient.js

const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION || 'ap-southeast-1',
  endpoint: process.env.DYNAMO_ENDPOINT || 'http://dynamodb-local:8000',


  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'fakeAccessKey',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'fakeSecretKey',
});

const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports = dynamo;
