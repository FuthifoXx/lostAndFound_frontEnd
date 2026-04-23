// const API_URL = 'http://localhost:5000/api/auth'

import { data } from 'react-router-dom'

// export const loginUser = async (data) => {
//   const res = await fetch(`${API_URL}/login`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   })

//   const result = await res.json()

//   if (!res.ok) {
//     throw new Error(result.message || 'Login failed')
//   }

//   return result
// }

const API_URL = 'http://localhost:5000/api'

// Get token from localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  return user?.token
}

// Generic request function
export const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const token = getToken()

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: data ? JSON.stringify(data) : null,
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.message || 'Something went wrong')
  }

  return result
}

export const loginUser = async (data) => {
  const res = await fetch(`http://localhost:5000/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.message || 'Login failed')
  }

  return result
}

// get my lost items
export const getMyItems = () => {
  return apiRequest('/lost-items/my-items')
}

export const createLostItem = (data) => {
  return apiRequest('/lost-items', 'POST', data)
}
