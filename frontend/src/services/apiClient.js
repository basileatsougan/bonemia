// Client HTTP centralisé avec gestion automatique des tokens
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
    this.refreshPromise = null
  }

  // Stockage des tokens
  setTokens(access, refresh) {
    if (access) localStorage.setItem('access_token', access)
    if (refresh) localStorage.setItem('refresh_token', refresh)
  }

  clearTokens() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  getAccessToken() {
    return localStorage.getItem('access_token')
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token')
  }

  // Rafraîchir le token automatiquement
  async refreshToken() {
    if (this.refreshPromise) return this.refreshPromise

    this.refreshPromise = (async () => {
      const refresh = this.getRefreshToken()
      if (!refresh) throw new Error('No refresh token')

      const response = await fetch(`${this.baseURL}/auth/jwt/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh })
      })

      if (!response.ok) throw new Error('Refresh failed')

      const data = await response.json()
      this.setTokens(data.access, null)
      return data.access
    })()

    try {
      const newToken = await this.refreshPromise
      return newToken
    } finally {
      this.refreshPromise = null
    }
  }

  // Requête HTTP avec retry automatique
  async request(endpoint, options = {}) {
    const makeRequest = async (token) => {
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers
      })

      // Token expiré → tentative de refresh
      if (response.status === 401 && token) {
        const newToken = await this.refreshToken()
        return makeRequest(newToken)
      }

      return response
    }

    const token = this.getAccessToken()
    const response = await makeRequest(token)

    // Pour les réponses vides (204 No Content)
    if (response.status === 204) {
      return null
    }

    const data = await response.json()
    
    if (!response.ok) {
      throw { status: response.status, data }
    }

    return data
  }

  // Méthodes pratiques
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  post(endpoint, body) {
    return this.request(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(body) 
    })
  }

  put(endpoint, body) {
    return this.request(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(body) 
    })
  }

  patch(endpoint, body) {
    return this.request(endpoint, { 
      method: 'PATCH', 
      body: JSON.stringify(body) 
    })
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()