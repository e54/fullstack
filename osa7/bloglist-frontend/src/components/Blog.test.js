import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

const testUser = {
  name: 'Test Userson',
  username: 'tuserson'
}

const testBlog = {
  title: 'Test title',
  author: 'Test T. Authorson',
  url: 'www.test.io',
  likes: 10,
  user: testUser
}

const mockHandler = jest.fn()
let component

beforeEach(() => {
  mockHandler.mockClear()
  component = render(
    <Blog blog={testBlog} likeBlog={mockHandler} user={testUser} removeBlog={mockHandler}/>
  )
})

test('renders title and author but not url and likes', () => {
  const blogElement = component.container.querySelector('.blog')
  expect(blogElement).toHaveTextContent('Test title')
  expect(blogElement).toHaveTextContent('Test T. Authorson')

  const expandableContent = component.container.querySelector('.expandableContent')
  expect(expandableContent).toHaveStyle('display:none')
})

test('url and likes are shown when blog is expanded', () => {
  const button = component.getByText('view')
  fireEvent.click(button)

  const expandableContent = component.container.querySelector('.expandableContent')
  expect(expandableContent).not.toHaveStyle('display:none')

  const blogElement = component.container.querySelector('.blog')
  expect(blogElement).toHaveTextContent('www.test.io')
  expect(blogElement).toHaveTextContent('likes 10')
})

test('pressing the like button two times', () => {
  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})