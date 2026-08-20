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
  return apiRequest(`/lost-items/${id}/claim`, 'PUT')
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
  return apiRequest(`/lost-items/${id}/approve`, 'PUT')
}

//get dashboard stats
export const getDashboardStats = async () => {
  return apiRequest('/lost-items/stats/dashboard')
}

//get partner items
export const getPartnerItems = async () => {
  return apiRequest('/lost-items/partner/items')
}

//get admin dashboard data
export const getAdminDashboardData = async () => {
  return apiRequest('/lost-items/admin/dashboard')
}

//get recovery history
export const getRecoveryHistory = async () => {
  return apiRequest('/lost-items/recovery-history')
}

//mark as recovered
export const markAsRecovered = async (id) => {
  return apiRequest(`/lost-items/${id}/recover`, 'PUT')
}

//closeCase
export const closeCase = async (id) => {
  return apiRequest(`/lost-items/${id}/close`, 'PUT')
}

//get recovery analytics
export const getRecoveryAnalytics = async () => {
  return apiRequest('/lost-items/analytics/recovery')
}

//get branch performance
export const getBranchPerformance = async () => {
  return apiRequest('/lost-items/analytics/branches')
}

//get item timeline
export const getItemTimeline = async (id) => {
  return apiRequest(`/lost-items/${id}/timeline`)
}

//register user
export const registerUser = async (formData) => {
  return apiRequest('/auth/register', 'POST', formData)
}

//get me
export const getMe = async () => {
  return apiRequest('/auth/me')
}

// update me
export const updateMe = async (formData) => {
  return apiRequest('/auth/me', 'PUT', formData)
}

//delete me
export const deleteMe = async () => {
  return apiRequest('/auth/me', 'DELETE')
}

//get all users
export const getAllUsers = async () => {
  return apiRequest('/auth/users')
}

//get user by id
export const getUserById = async (id) => {
  return apiRequest(`/auth/users/${id}`)
}

//update user by id
export const updateUserById = async (id, data) => {
  return apiRequest(`/auth/users/${id}`, 'PUT', data)
}

//delete user by id
export const deleteUserById = async (id) => {
  return apiRequest(`/auth/users/${id}`, 'DELETE')
}

//get partners
export const getPartners = async () => {
  return apiRequest('/partners')
}

//create partner
export const createPartner = async (data) => {
  return apiRequest('/partners', 'POST', data)
}

//verify partner
export const verifyPartner = async (id) => {
  return apiRequest(`/partners/${id}/verify`, 'PUT')
}    

//assign user to partner
export const assignUserToPartner = async (partnerId, userId) => {
  return apiRequest(`/partners/${partnerId}/assign-user/${userId}`, 'PUT')
}

//get case notes
export const getCaseNotes = async (id) => {
  return apiRequest(`/case-notes/${id}/notes`)
}

//add case note
export const addCaseNote = async (id, note) => {
  return apiRequest(`/case-notes/${id}/notes`, 'POST', { note })
}

//Get receipt by item
export const getReceipt = async (itemId) => {
  return apiRequest(`/receipts/${itemId}`)
}

//Create receipt
export const createReceipt = async (itemId, data) => {
  return apiRequest(`/receipts/${itemId}`, 'POST', data)
}

//Download receipt PDF
export const downloadReceiptPDF = async (itemId) => {
  const token = getToken()

  const res = await fetch(`${API_URL}/receipts/${itemId}/pdf`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  if (!res.ok) {
    const result = await res.json()
    throw new Error(result.message || 'Failed to download receipt')
  }

  return res.blob()
}

export const verifyReceipt = async (receiptNumber) => {
  const res = await fetch(`${API_URL}/receipts/verify/${receiptNumber}`)

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.message || 'Receipt verification failed')
  }

  return result
}

