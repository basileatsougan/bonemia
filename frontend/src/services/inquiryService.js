import { apiClient } from './apiClient'

class InquiryService {
  // Créer une demande d'abonnement
  async createInquiry(inquiryData) {
    // Ne garder que les champs dont le backend a besoin
    const payload = {
      name: inquiryData.name,
      phone_number: inquiryData.phoneNumber,
      subscription: inquiryData.subscriptionId
    }
    
    return apiClient.post('/api/inquiries/', payload)
  }

  // Obtenir les demandes de l'utilisateur (si besoin)
  async getUserInquiries() {
    return apiClient.get('/api/inquiries/my/')
  }
}

export const inquiryService = new InquiryService()