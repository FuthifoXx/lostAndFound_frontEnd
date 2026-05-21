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

// get my lost items
export const createLostItem = async (data) => {
  const token = JSON.parse(localStorage.getItem('user'))?.token

  const res = await fetch('http://localhost:5000/api/lost-items', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // DO NOT set Content-Type here
    },
    body: data,
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.message || 'Failed to create item')
  }

  return result
}

export const deleteLostItem = async (id) => {
  return apiRequest(`/lost-items/${id}`, 'DELETE')
}

export const updateLostItem = async (id, data) => {
  return apiRequest(`/lost-items/${id}`, 'PUT', data)
}

export const getNotifications = async () => {
  return apiRequest('/notifications')
}

export const getAllItems = async (keyword = '') => {
  const res = await fetch(
    `http://localhost:5000/api/lost-items?keyword=${keyword}`,
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch items')
  }

  return data.items
}

export const getSingleItem = async (id) => {
  const res = await fetch(`${API_URL}/lost-items/${id}`)

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch item')
  }

  return data
}

export const requestClaim = async (id) => {
  return apiRequest(`/lost-item/${id}/claim`, 'POST')
}

export const getPendingClaims = async () => {
  return apiRequest('/lost-items/pending-claims')
}

export const approveClaim = async (id) => {
  return apiRequest(`/lost-items/${id}/approve-claim`, 'PUT')
}

export const rejectClaim = async (id) => {
  return apiRequest(`/lost-items/${id}/reject-claim`, 'PUT')
}

//get pending items
export const getPendingItems = () => {
  return apiRequest('/lost-items/pending')
}

//approve item
export const approveItem = (id) => {
  return apiRequest(`/lost-item/${id}/approve`, 'PUT')
}