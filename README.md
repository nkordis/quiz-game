# Serverless Quiz Api

a Quiz application using Nodejs, AWS Lambda and Serverless framework.

# Functionality of the application

This application allows creating/removing/updating/fetching Quiz items. Each Quiz item can optionally have an attachment image. Each user only has access to edit QUIZ items that he/she has created.

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
      "attachmentUrl": "http://example.com/image.png"
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

All necessary resources like DynamoDB table and S3 bucket have been added to the `resources` section of the `serverless.yml`.

## Authentication

Authentication has been implemented with Ath0 using asymmetrically encrypted JWT tokens.

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

# Postman collection

To test the API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project.

