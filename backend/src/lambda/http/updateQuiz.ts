import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { UpdateQuizRequest } from '../../requests/UpdateQuizRequest'
import { updateQuiz } from '../../businessLogic/quizzes';
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateQuiz')

/**
 * Handles PATCH /quizzes/{quizId} endpoint
 * @param {APIGatewayProxyEvent} event request to update a Quiz by id
 * @returns {APIGatewayProxyResult} empty body
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    
    const quizToUpdate: UpdateQuizRequest = JSON.parse(event.body)
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    const quizId = event.pathParameters.quizId
  
      await updateQuiz(jwtToken, quizId, quizToUpdate);
  
      return {
        statusCode: 204, 
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: ''
      }
  
  }
