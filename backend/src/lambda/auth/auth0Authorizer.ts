import 'source-map-support/register'

import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import { verify, decode  } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// A URL that can be used to download a certificate(JSON Web Key Set) that can be used
// to verify JWT token signature.
const jwksUrl = 'https://dev-u23y6q-y.eu.auth0.com/.well-known/jwks.json'


/**
 * Authorize a user using the request's authorization token
 * @returns a CustomAuthorizerResult
 */
export const handler = async (
    event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
    logger.info('Authorizing a user', event.authorizationToken)
    try {
        const jwtToken = await verifyToken(event.authorizationToken)
        logger.info('User was authorized', jwtToken)

        return {
            principalId: jwtToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        }
    } catch (e) {
        logger.error('User not authorized', { error: e.message })

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }
    }
}

/**
 * Verify the token from the request's authorization header
 * @param authHeader request's authorization header to parse
 * @returns a JwtPayload
 */
async function verifyToken(authHeader: string): Promise<JwtPayload> {
    const token = getToken(authHeader)
    const jwt: Jwt = decode(token, { complete: true }) as Jwt
    
    const jwks = await Axios.get(jwksUrl);
    let cert1 = "";

    jwks.data.keys.forEach(element => {
        if(element.kid === jwt.header.kid){
            cert1 = element.x5c[0]
        }
    });

    const cert2 = `-----BEGIN CERTIFICATE-----\n${cert1}\n-----END CERTIFICATE-----\n`
   
    return verify(token, cert2, { algorithms: ['RS256'] }) as JwtPayload
}

/**
 * Extract the token from the request's authorization header
 * @param authHeader request's authorization header to parse
 * @returns a token from the header
 */
function getToken(authHeader: string): string {
    if (!authHeader) throw new Error('No authentication header')

    if (!authHeader.toLowerCase().startsWith('bearer '))
        throw new Error('Invalid authentication header')

    const split = authHeader.split(' ')
    const token = split[1]

    return token
}