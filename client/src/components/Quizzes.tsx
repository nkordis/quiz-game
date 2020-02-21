import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createquiz, deletequiz, getquizzes, patchquiz } from '../api/quizzes-api'
import Auth from '../auth/Auth'
import { QuizItem } from '../types/QuizItem'

interface quizzesProps {
  auth: Auth
  history: History
}

interface quizzesState {
  quizzes: QuizItem[]
  newCategoryName: string,
  newTypeName: string,
  newDifficultyName: string,
  newQuizName: string,
  newCorrectAnswersName: string,
  newIncorrectAnswersName: string[],
  loadingquizzes: boolean
}

export class Quizzes extends React.PureComponent<quizzesProps, quizzesState> {
  state: quizzesState = {
    quizzes: [],

    newCategoryName: 'category',
    newTypeName: 'type',
    newDifficultyName: 'difficulty',
    newQuizName: 'quiz',
    newCorrectAnswersName: 'a',
    newIncorrectAnswersName: ['a', 'c', 'd'],
    loadingquizzes: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newQuizName: event.target.value })
  }

  handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCategoryName: event.target.value })
  }

  handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTypeName: event.target.value })
  }

  handleDifficultyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDifficultyName: event.target.value })
  }

  handleCorrectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCorrectAnswersName: event.target.value })
  }

  onEditButtonClick = (quizId: string) => {
    this.props.history.push(`/quizzes/${quizId}/edit`)
  }

  onquizCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newquiz = await createquiz(this.props.auth.getIdToken(), {
        category: this.state.newCategoryName,
        type: this.state.newTypeName,
        difficulty: this.state.newDifficultyName,
        quiz: this.state.newQuizName,
        correct_answer: this.state.newCorrectAnswersName,
        incorrect_answers: this.state.newIncorrectAnswersName
      })
      this.setState({
        quizzes: [...this.state.quizzes, newquiz],
        newQuizName: ''
      })
    } catch {
      alert('quiz creation failed')
    }
  }

  onquizDelete = async (quizId: string) => {
    try {
      await deletequiz(this.props.auth.getIdToken(), quizId)
      this.setState({
        quizzes: this.state.quizzes.filter(quiz => quiz.quizId != quizId)
      })
    } catch {
      alert('quiz deletion failed')
    }
  }

  onquizCheck = async (pos: number) => {
    try {
      const quiz = this.state.quizzes[pos]
      await patchquiz(this.props.auth.getIdToken(), quiz.quizId, {
        category: quiz.category,
        type: quiz.type,
        difficulty: quiz.difficulty,
        quiz: quiz.quiz,
        correct_answer: quiz.correct_answer,
        incorrect_answers: quiz.incorrect_answers
      })
      this.setState({
        quizzes: update(this.state.quizzes, {
          // [pos]: { done: { $set: !quiz.done } }
        })
      })
    } catch {
      alert('quiz deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const quizzes = await getquizzes(this.props.auth.getIdToken())
      this.setState({
        quizzes,
        loadingquizzes: false
      })
    } catch (e) {
      alert(`Failed to fetch quizzes: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Quizzes</Header>

        {this.renderCreatequizInput()}

        {this.renderquizzes()}
      </div>
    )
  }

  renderCreatequizInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New quiz',
              onClick: this.onquizCreate
            }}
            fluid
            actionPosition="left"
            placeholder="quiz"
            onChange={this.handleNameChange}
          />
          <input
            type='text'
            name='category'
            placeholder="category"
            onChange={this.handleCategoryChange}
          />
          <input
            type='text'
            name='type'
            placeholder="type"
            onChange={this.handleTypeChange}
          />
          <input
            type='text'
            name='difficulty'
            placeholder="difficulty"
            onChange={this.handleDifficultyChange}
          />
          <input
            type='text'
            name='correct_answer'
            placeholder="correct answer"
            onChange={this.handleCorrectChange}
          />

        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderquizzes() {
    if (this.state.loadingquizzes) {
      return this.renderLoading()
    }

    return this.renderquizzesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading quizzes
        </Loader>
      </Grid.Row>
    )
  }

  renderquizzesList() {
    return (
      <Grid padded>
        {this.state.quizzes.map((quiz, pos) => {
          return (
            <Grid.Row key={quiz.quizId}>
              {/*  <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onquizCheck(pos)}
                  checked={false}
          /> 
              </Grid.Column> */}
              <Grid.Column width={4} verticalAlign="middle">
                {quiz.quiz}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                {quiz.category}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                {quiz.type}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                {quiz.difficulty}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                {quiz.correct_answer}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(quiz.quizId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onquizDelete(quiz.quizId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {quiz.attachmentUrl && (
                <Image src={quiz.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>

            </Grid.Row>

          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
