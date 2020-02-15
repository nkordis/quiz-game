import { createLogger } from '../utils/logger'
import { QuizItem } from '../models/QuizItem'
import { QuizAccess } from '../dataLayer/quizAccess'
import { parseUserId } from '../auth/utils'

const logger = createLogger('quizzesBusinessLogic')
const quizAccess = new QuizAccess()

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
