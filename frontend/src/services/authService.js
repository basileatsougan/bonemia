import { apiClient } from './apiClient'

class AuthService {
  // Inscription (email seulement)
  async register(email) {
    return apiClient.post('/auth/users/', { email })
  }

  // Connexion avec code (passwordless)
  async loginWithCode(email, code) {
    const data = await apiClient.post('/auth/jwt/create/', { 
      email, 
      code 
    })
    
    if (data.access && data.refresh) {
      apiClient.setTokens(data.access, data.refresh)
    }
    
    return data
  }

  // Connexion avec mot de passe (pour staff/admin)
  async loginWithPassword(email, password) {
    const data = await apiClient.post('/auth/jwt/create/', { 
      email, 
      password 
    })
    
    if (data.access && data.refresh) {
      apiClient.setTokens(data.access, data.refresh)
    }
    
    return data
  }

  // Déconnexion
  logout() {
    apiClient.clearTokens()
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    const token = apiClient.getAccessToken()
    return !!token
  }

  // Obtenir l'utilisateur courant
  async getCurrentUser() {
    if (!this.isAuthenticated()) return null
    
    try {
      return await apiClient.get('/auth/users/me/')
    } catch (error) {
      if (error.status === 401) {
        this.logout()
      }
      return null
    }
  }

  // Demander un nouveau code (si perdu/expiré)
  async requestNewCode(email) {
    // Note: Vérifiez si votre backend a cet endpoint
    // Sinon, on peut réutiliser register
    return apiClient.post('/auth/users/resend_code/', { email })
  }
}

export const authService = new AuthService()