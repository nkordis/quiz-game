import { apiEndpoint } from '../config'
import { QuizItem } from '../types/QuizItem';
import { CreateQuizRequest } from '../types/CreateQuizRequest';
import Axios from 'axios'
import { UpdateQuizRequest } from '../types/UpdateQuizRequest';

export async function getquizzes(idToken: string): Promise<QuizItem[]> {
  console.log('Fetching quizzes')

  const response = await Axios.get(`${apiEndpoint}/quizzes`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Quizzes:', response.data)
  return response.data.items
}

export async function createquiz(
  idToken: string,
  newquiz: CreateQuizRequest
): Promise<QuizItem> {
  const response = await Axios.post(`${apiEndpoint}/quizzes`,  JSON.stringify(newquiz), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchquiz(
  idToken: string,
  quizId: string,
  updatedquiz: UpdateQuizRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/quizzes/${quizId}`, JSON.stringify(updatedquiz), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deletequiz(
  idToken: string,
  quizId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/quizzes/${quizId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  quizId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/quizzes/${quizId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
