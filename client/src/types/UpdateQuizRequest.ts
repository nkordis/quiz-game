/**
 * Fields in a request to update a single Quiz item.
 */
export interface UpdateQuizRequest {
    category: string,
	type: string,
	difficulty: string,
	quiz: string,
	correct_answer: string,
	incorrect_answers: string[]
  }