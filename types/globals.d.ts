export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      isOnboardingComplete?: boolean
    }
  }
}