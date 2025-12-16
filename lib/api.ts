export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

export async function submitContactApi(data: { name: string; email: string; subject: string; message: string }) {
  const res = await fetch(`${BACKEND_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = (body && body.message) || res.statusText || 'Server error'
    throw new Error(err)
  }
  return body
}

export async function submitFeedbackApi(data: { name: string; email: string; category: string; rating: string; message: string }, token?: string) {
  const res = await fetch(`${BACKEND_URL}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = (body && body.message) || res.statusText || 'Server error'
    throw new Error(err)
  }
  return body
}

// Profile API Functions

export async function getProfileApi(token?: string) {
  const authToken = token || getAuthToken()
  
  if (!authToken) {
    throw new Error('Authentication required. Please login first.')
  }

  const res = await fetch(`${BACKEND_URL}/api/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = (body && body.message) || res.statusText || 'Server error'
    throw new Error(err)
  }
  return body
}

export async function updateProfileApi(data: any, token?: string) {
  const authToken = token || getAuthToken()
  
  if (!authToken) {
    throw new Error('Authentication required. Please login first.')
  }

  const res = await fetch(`${BACKEND_URL}/api/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = (body && body.message) || res.statusText || 'Server error'
    throw new Error(err)
  }
  return body
}

// Internship API Functions

// Helper function to get company token
const getCompanyToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('companyToken')
  }
  return null
}

export async function createInternshipApi(data: any, token?: string) {
  const authToken = token || getCompanyToken()
  
  if (!authToken) {
    throw new Error('Authentication required. Please login first.')
  }

  const res = await fetch(`${BACKEND_URL}/api/internships`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = (body && body.message) || res.statusText || 'Server error'
    throw new Error(err)
  }
  return body
}

export async function getMyInternshipsApi(token?: string) {
  const authToken = token || getCompanyToken()
  
  if (!authToken) {
    throw new Error('Authentication required. Please login first.')
  }

  const res = await fetch(`${BACKEND_URL}/api/internships/company/my-internships`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = (body && body.message) || res.statusText || 'Server error'
    throw new Error(err)
  }
  return body
}

export async function getAllInternshipsApi(params?: {
  search?: string;
  city?: string;
  stipendType?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const queryParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value))
      }
    })
  }

  const url = `${BACKEND_URL}/api/internships${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = (body && body.message) || res.statusText || 'Server error'
    throw new Error(err)
  }
  return body
}

export async function getInternshipByIdApi(id: string) {
  const res = await fetch(`${BACKEND_URL}/api/internships/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = (body && body.message) || res.statusText || 'Server error'
    throw new Error(err)
  }
  return body
}

export async function updateInternshipApi(id: string, data: any, token?: string) {
  const authToken = token || getCompanyToken()
  
  if (!authToken) {
    throw new Error('Authentication required. Please login first.')
  }

  const res = await fetch(`${BACKEND_URL}/api/internships/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = (body && body.message) || res.statusText || 'Server error'
    throw new Error(err)
  }
  return body
}

export async function deleteInternshipApi(id: string, token?: string) {
  const authToken = token || getCompanyToken()
  
  if (!authToken) {
    throw new Error('Authentication required. Please login first.')
  }

  const res = await fetch(`${BACKEND_URL}/api/internships/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = (body && body.message) || res.statusText || 'Server error'
    throw new Error(err)
  }
  return body
}

export async function getInternshipStatsApi() {
  const res = await fetch(`${BACKEND_URL}/api/internships/stats/overview`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = (body && body.message) || res.statusText || 'Server error'
    throw new Error(err)
  }
  return body
}
