/**
 * Fields in a request to create a single Quiz item.
 */
export interface CreateQuizRequest {
    category: string,
	type: string,
	difficulty: string,
	quiz: string,
	correct_answer: string,
	incorrect_answers: string[],
    attachmentUrl?: string
  }