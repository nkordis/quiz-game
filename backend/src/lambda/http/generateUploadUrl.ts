import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { generateUploadUrl } from '../../businessLogic/quizzes'

/**
 * Handles POST /quizzes/{quizId}/attachment endpoint.
 * @param {APIGatewayProxyEvent} event request to get  a presigned URL to upload an image for a quiz item with the provided id
 * @returns {APIGatewayProxyResult} the presigned URL 
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const quizId = event.pathParameters.quizId

  const url = generateUploadUrl(quizId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}