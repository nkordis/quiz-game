import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getQuizzes } from '../../businessLogic/quizzes';

const logger = createLogger('getQuizzes')

/**
 * Handles GET /quizzes endpoint
 * @param {APIGatewayProxyEvent} event request to get the quizzes created by the user
 * @returns {APIGatewayProxyResult} the quizzes created by the user
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)

    const authorization = event.headers.Authorization 
    const split = authorization.split(' ')
    const jwtToken = split[1]

    const items = await getQuizzes(jwtToken)

    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          items
        })
      }

}