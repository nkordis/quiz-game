import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteQuiz } from '../../businessLogic/quizzes';
import { createLogger } from '../../utils/logger'

const logger = createLogger('createQuiz')

/**
 * Handles DELETE /quizzes/{quizId} endpoint
 * @param {APIGatewayProxyEvent} event request to delete a Quiz by id
 * @returns {APIGatewayProxyResult} empty body
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
  
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    const quizId = event.pathParameters.quizId
  
      await deleteQuiz(jwtToken, quizId);
  
      return {
        statusCode: 204, 
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: ''
      }
  
  }

  