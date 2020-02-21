/**
 * Interface representing a Quiz item 
 */
export interface QuizItem {
    userId: string
    quizId: string
    createdAt: string
    category: string
    type: string
    difficulty: string
    quiz: string
    correct_answer: string
    incorrect_answers: string[]
    attachmentUrl?: string
  }
 