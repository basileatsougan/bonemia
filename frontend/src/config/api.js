const API_CONFIG = {
  development: {
    BASE_URL: 'http://localhost:8000'  // On enlève /api
  },
  production: {
    BASE_URL: 'https://api.com'  // À changer au déploiement
  }
}

const env = import.meta.env.MODE || 'development'
export const API_BASE_URL = API_CONFIG[env].BASE_URL