# Batch Service

This service enables you to invoke batch requests, within other services

## Method of Operation
* Performs a batch operation on N http calls to a specific endpoint
* For GET / DELETE / PUT / PATCH requests, request's body should be of the form:
```
 {
   "endpoint":{
      "verb":"HTTP_VERB",
      "url":"https://example.com/endpoint/{resourceId}"
   },
   "payload":[
      {
         "id":12,
         "body": jsonBody1
      },
      {
         "id":20,
         "body": jsonBody2
      }
   ]
  }
```
* For POST you don't need IDs, as you're creating a new resource, so this should be good:
```
 {
   "endpoint":{
      "verb":"HTTP_VERB",
      "url":"https://example.com/endpoint"
   },
   "payload":[
      {
         "body": jsonBody1
      },
      {
         "body": jsonBody2
      }
   ]
  }
```

## Prerequisites
node6.10.0

## How to bootstrap the project

1. git clone https://github.com/gregra81/nodejs-batch-service.git
2. cd nodejs-batch-service
2. nvm use (optional, only if you have nvm)
3. npm install
4. npm start

Server will start on http://localhost:3001

## API

* See swagger file here: https://app.swaggerhub.com/apis/gregra/batch-editing-service
