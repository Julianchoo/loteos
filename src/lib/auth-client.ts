import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  // No baseURL specified - BetterAuth defaults to relative paths
  // This prevents mixed content errors on HTTPS pages
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
  requestPasswordReset,
  resetPassword,
  sendVerificationEmail,
} = authClient