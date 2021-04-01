import { useState, useEffect } from 'react'
import axios from 'axios'

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    axios.get(baseUrl)
      .then(result => {
        console.log('getting from', baseUrl)
        console.log('got', result)
        setResources(result.data)
      })
      .catch(error => console.log(error))
  }, [resources.length])

  const create = (resource) => {
    axios.post(baseUrl, resource)
      .then(response => setResources(resources.concat(response.data)))
      .catch(error => console.log(error))
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}