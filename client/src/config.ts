//The API id so that the frontend could interact with it
const apiId = 'w0r626jnbc'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  
  domain: 'dev-u23y6q-y.eu.auth0.com',            // Auth0 domain
  clientId: 'YePRH57PWB7Ou6VHXe60GO4WPkOZeBJU',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
