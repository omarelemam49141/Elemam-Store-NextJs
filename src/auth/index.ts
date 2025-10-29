import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { CART_ID_SESSION } from "@/lib/constants";
import { NextResponse } from "next/server";
import { EdgeAuthService } from "@/services/auth/edge-auth-service";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Sign In",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@email.email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        return await EdgeAuthService.validateCredentials(
          credentials.email as string,
          credentials.password as string
        );
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }) {
      session.user.id = token.sub!;
      session.user.role = token.role as string;
      session.user.name = token.name;

      if (trigger == "update") {
        session.user.name = user.name;
      }
      return session;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;

        if (!user.name) {
          token.name = user.email!.split("@")[0];
          // Note: We'll update the user name in the API route instead of here
          // to avoid Prisma calls in the Edge Function
        } else {
          token.name = user.name;
        }
      }

      if (trigger === "update") {
        token.name = session.user.name
      }

      // Note: Cart migration is now handled by server actions
      // to avoid Prisma imports in Edge Runtime

      return token;
    },

    async authorized({request}) {
      const cartIdSession = request.cookies.get(CART_ID_SESSION);
      if (!cartIdSession) {
        const newCartIdSession = crypto.randomUUID();
        const response = NextResponse.next();
        response.cookies.set(CART_ID_SESSION, newCartIdSession);
        return response;
      }
      return true;
    }
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
