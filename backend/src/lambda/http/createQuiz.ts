import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateQuizRequest } from '../../requests/CreateQuizRequest'
import { createLogger } from '../../utils/logger'
import { createQuiz } from '../../businessLogic/quizzes';

const logger = createLogger('createQuiz')

/**
 * Handles POST /quizzes endpoint
 * @param {APIGatewayProxyEvent} event request to create a new Quiz
 * @returns {APIGatewayProxyResult} the Quiz created
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const newQuiz: CreateQuizRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization 
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const item = await createQuiz(newQuiz, jwtToken);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item
    })
  }
}