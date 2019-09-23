# fb-chatbot-serverless
facebook chatbot serverless is simple fb-chatbot lambda on AWS.

## Getting Started

These instructions will get you a copy of the project up.
See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software

```
1. register aws console account
2. install aws cli
3. run aws configure on your terminal for storing access key and secret access key
cat ~/.aws/credentials for checking your key
4. go to aws console and create secret key on AWS and locate it on telecommerce/deployment/aws
please using key file name as "telecommerce"
```

### Deployment

A step by step how to get a development env running
execute this file to create a serverless on AWS

```
sls deploy
```

Then go to AWS consule and see progress in lambda menu and see logs in cloudwatch.

for delete serverless able to excute this command.
```
sls remove
```

## Running the tests

access "endpoints" for testing.
