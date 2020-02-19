import * as uuid from 'uuid'
import { createLogger } from '../utils/logger'
import { QuizItem } from '../models/QuizItem'
import { QuizAccess } from '../dataLayer/quizAccess'
import { CreateQuizRequest } from '../requests/CreateQuizRequest'
import { UpdateQuizRequest } from '../requests/UpdateQuizRequest'
import { parseUserId } from '../auth/utils'
import { QuizStorage } from '../lambda/s3/QuizStorage'


const logger = createLogger('quizzesBusinessLogic')
const quizAccess = new QuizAccess()
const quizStorage = new QuizStorage()

/**
 * Requests quiz items by jwt token
 * @param {string} jwtToken user's jwt token
 * @returns {QuizItem[]} an array of Quiz items
 */
export async function getQuizzes(jwtToken: string): Promise<QuizItem[]> {
    logger.info('Request quiz items by jwt')

    const userId = parseUserId(jwtToken)

    return quizAccess.getQuizzes(userId)
}

/**
 * Creates a new quiz item
 * @param {string} jwtToken user's jwt token
 * @param {CreateQuizRequest} createQuizRequest the quiz to create
 * @returns {Object} the quiz created without the userId
 */
export async function createQuiz(
    createQuizRequest: CreateQuizRequest,
    jwtToken: string
): Promise<Object> {
    logger.info('Request to creat a new quiz item')
    const itemId = uuid.v4()
    const userId = parseUserId(jwtToken)
    const bucketName = quizStorage.getBucketName();

    //a new Quiz item to store
    const newItem = {
        userId: userId,
        quizId: itemId,
        createdAt: new Date().toISOString(),
        ...createQuizRequest,
        done: false,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`
    }

    await quizAccess.createQuiz(newItem)

    //item to return
    const item = {
        quizId: itemId,
        createdAt: new Date().toISOString(),
        ...createQuizRequest,
        done: false,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`
    }

    return item




}

/**
 * Deletes a quiz item by quiz id
 * @param {string} jwtToken user's jwt token
 * @param {string} quizId quiz id to delete
 * @returns {QuizItem} the deleted item
 */
export async function deleteQuiz(jwtToken: string, quizId: string): Promise<QuizItem> {
    logger.info('Request to delete a quiz item by quiz id')

    const userId = parseUserId(jwtToken)
    return quizAccess.deleteQuiz(userId, quizId)


}

/**
 * Updates a quiz item by quiz id
 * @param {string} jwtToken user's jwt token
 * @param {string} quizId quiz id
 * @param {UpdateQuizRequest} quizToUpdate quiz's values to update
 * @returns {QuizItem} the old item
 */
export async function updateQuiz(jwtToken: string, quizId: string, quizToUpdate: UpdateQuizRequest): Promise<QuizItem> {
    logger.info('Request to delete a quiz item by quiz id')

    const userId = parseUserId(jwtToken)

    return quizAccess.updateQuiz(userId, quizId, quizToUpdate);

}

export function generateUploadUrl(quizId: string) {
    logger.info('Request a url to upload an image')
    
    return quizStorage.getUploadUrl(quizId)
}