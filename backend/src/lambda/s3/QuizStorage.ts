import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../../utils/logger'

const logger = createLogger('quizStorage')
const XAWS = AWSXRay.captureAWS(AWS)

/**
* A class to handle S3 storage.
* @constructor
* @param {string} bucketName the name of the backet
* @param {number} urlExpiration url's expiration in seconds
* @param {AWS} s3  the s3 bucket
*/
export class QuizStorage {

    constructor(
        private readonly bucketName = process.env.QUIZ_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
        private s3 = new XAWS.S3({
            signatureVersion: 'v4'
        })
    ) { }

    /**
     * Gets the backet's url to upload an image for a quiz item
     * @param {string} quizId the quiz's id
     * @returns {string} backet's url
     */
    getUploadUrl(quizId: string) {
        logger.info('Getting the the backet\'s url ')

        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: quizId,
            Expires: parseInt(this.urlExpiration)
        })
    }

    /**
     * Gets the backet's name
     * @returns {string} backet's name
     */
    getBucketName() {
        return this.bucketName;
    }

}