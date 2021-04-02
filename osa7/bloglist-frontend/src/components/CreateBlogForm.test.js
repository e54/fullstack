import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import CreateBlogForm from './CreateBlogForm'

test('correct data is passed when creating a blog', () => {
  const createBlog = jest.fn()

  const component = render(
    <CreateBlogForm createBlog={createBlog} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')

  fireEvent.change(title, {
    target: { value: 'Testing blog number one' }
  })
  fireEvent.change(author, {
    target: { value: 'Kent Test' }
  })
  fireEvent.change(url, {
    target: { value: 'www.testnumerouno.es' }
  })

  const form = component.container.querySelector('form')
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  const callData = createBlog.mock.calls[0][0]
  expect(callData.title).toStrictEqual('Testing blog number one')
  expect(callData.author).toStrictEqual('Kent Test')
  expect(callData.url).toStrictEqual('www.testnumerouno.es')
})