// Lightweight auth service for Edge Functions
// This doesn't import Prisma to keep the bundle size small

export class EdgeAuthService {
  static async validateCredentials(email: string, password: string) {
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Edge auth validation error:', error);
      return null;
    }
  }
}
