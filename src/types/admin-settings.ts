export interface AdminSettings {
  general: {
    siteName: string
    supportEmail: string
    timezone: string
  }
  features: {
    watchHistoryEnabled: boolean
    reviewsEnabled: boolean
  }
  security: {
    sessionTimeout: number
  }
}