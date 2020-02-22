# Serverless Quiz Api

Api to perform basic crud operations on quiz items using  Nodejs, AWS Lambda and Serverless framework.

# Functionality of the application

This application allows creating/removing/updating/fetching QUIZ items. Each Quiz item can optionally have an attachment image. Each user only has access to edit QUIZ items that he/she has created.

# QUIZ items

The application stores QUIZ items, and each QUIZ item contains the following fields:

* `quizId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `category` (string) - a category of a QUIZ item (e.g. "art")
* `type` (string) - a type of a QUIZ item (e.g. "multiple")
* `quiz` (string) - the question of a QUIZ item (e.g. "Who painted the Mona Lisa?")
* `correct_answer` (string) - the correct answer of a QUIZ item (e.g. "Leonardo da Vinci")
* `incorrect_answers` (string[]) - the incorrect answers of a QUIZ item (e.g. ["Pablo Picasso","Claude Monet","Vincent van Gogh"])
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a QUIZ item
* `userId` (string) - a unique id of a user who created a QUIZ item

# Lambda functions 

The following functions are implemented and configured in the `serverless.yml` file:

* `Auth` - a custom authorizer for API Gateway added to all other functions.

* `GetQuizzes` - returns all Quizzes for a current user. A user id can be extracted from a JWT token that is sent by the client

It returns data like this:

```json
{
  "items": [
    {
      "quizId": "fe671583-4512-45f6-9475-4265c04362fb",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "category": "art",
	    "type": "multiple",
	    "difficulty": "easy",
	    "quiz": "Who painted the Mona Lisa?",
	    "correct_answer": "Leonardo da Vinci",
	    "incorrect_answers": ["Pablo Picasso","Claude Monet","Vincent van Gogh"]
      "attachmentUrl" : "http://example.com/image.png"
    },
    {
      "quizId": "35dd600f-43c2-4649-903c-615e1586a26f",
      "createdAt": "2020-01-27T20:01:57.424Z",
      "category": "geography",
	    "type": "multiple",
	    "difficulty": "easy",
	    "quiz": "Which small country is located between the borders of France and Spain?",
	    "correct_answer": "Andorra",
	    "incorrect_answers": ["San Marino","Vatican City","Lichtenstein"]
      "attachmentUrl": "http://example.com/image.png"
    },
  ]
}
```

* `CreateQuiz` - creates a new QUIZ by the current user. The shape of data send by a client application to this function can be found in the `CreateQuizRequest.ts` file

It receives a new QUIZ item to be created in JSON format:

```json
{
  "category": "geography",
	"type": "multiple",
	"difficulty": "easy",
	"quiz": "Which small country is located between the borders of France and Spain?",
	"correct_answer": "Andorra",
	"incorrect_answers": ["San Marino","Vatican City","Lichtenstein"]
  "attachmentUrl": "http://example.com/image.png"
}
```

It returns a new QUIZ item:

```json
{
  "item": {
    "quizId": "35dd600f-43c2-4649-903c-615e1586a26f",
    "createdAt": "2020-01-27T20:01:57.424Z",
    "category": "geography",
	  "type": "multiple",
	  "difficulty": "easy",
	  "quiz": "Which small country is located between the borders of France and Spain?",
	  "correct_answer": "Andorra",
	  "incorrect_answers": ["San Marino","Vatican City","Lichtenstein"]
    "attachmentUrl": "http://example.com/image.png"
  }
}
```

* `UpdateQuiz` - updates a QUIZ item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateQuizRequest.ts` file

It receives an object that contains three fields that can be updated in a QUIZ item:

```json
{
 "category": "geography",
	"type": "multiple",
	"difficulty": "easy",
	"quiz": "Which small country is located between the borders of France and Spain?",
	"correct_answer": "Andorra",
	"incorrect_answers": ["San Marino","Vatican City","Lichtenstein"]
  "attachmentUrl": "http://example.com/image.png"
}
```

The id of an item that should be updated is passed as a URL parameter.

It returns an empty body.

* `DeleteQuiz` - deletes a Quiz item created by a current user. Expects an id of a QUIZ item to remove.

It returns an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a QUIZ item.

It returns a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

All necessary resources like DynamoDB table, API Gateway and S3 bucket have been added to the `resources` section of the `serverless.yml`.

## Authentication

Authentication has been implemented with Auth0 using asymmetrically encrypted JWT tokens.

# To use the api

## Endpoints

* Auth0 domain: dev-u23y6q-y.eu.auth0.com

* GET/ https://w0r626jnbc.execute-api.us-east-1.amazonaws.com/dev/quizzes
* POST/ https://w0r626jnbc.execute-api.us-east-1.amazonaws.com/dev/quizzes
* DELETE/ https://w0r626jnbc.execute-api.us-east-1.amazonaws.com/dev/quizzes/{quizId}
* PATCH/ https://w0r626jnbc.execute-api.us-east-1.amazonaws.com/dev/quizzes/{quizId}
* POST/ https://w0r626jnbc.execute-api.us-east-1.amazonaws.com/dev/quizzes/{quizId}/attachment

## Postman

You can find a Postman collection that contains sample requests to api's endpoints and also requests for passwordless authentication in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")


Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true "Image 4")

Provide variables for the collection:

![Alt text](images/import-collection-5.png?raw=true "Image 5")

## React client

To use the react client[under construction] provided in the project run the following commands:

```
cd client
npm install
npm run start
```
*** Patch item not supported yet
*** Quiz's incorrect answers not supported yet

# How to run a new standalone application

## Backend

To deploy a new application run the following commands:

```
cd backend
npm install
sls deploy -v
```
## Frontend

To run a client application first edit the client/src/config.ts file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

## Postman collection

To test the API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project.

## Logging

* The application comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements.

* Distributed tracing is enabled using AWS X-Ray.

# Resources

* Navigating RS256 and JWKS - https://auth0.com/blog/navigating-rs256-and-jwks/