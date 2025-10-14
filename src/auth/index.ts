import NextAuth from "next-auth";
import { prisma } from "../../db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import { CART_ID_SESSION } from "@/lib/constants";
import { NextResponse } from "next/server";

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
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        const userWithEmail = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        if (!userWithEmail) {
          return null;
        }

        const isCorrectPassword = await compare(
          credentials.password as string,
          userWithEmail.password as string
        );

        if (!isCorrectPassword) {
          return null;
        }

        return {
          id: userWithEmail.id,
          email: userWithEmail.email,
          name: userWithEmail.name,
          role: userWithEmail.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub!;
      session.user.role = token.role;
      session.user.name = token.name;

      if (trigger == "update") {
        session.user.name = user.name;
      }
      return session;
    },

    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.role = user.role;

        if (!user.name) {
          token.name = user.email!.split("@")[0];

          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        } else {
          token.name = user.name;
        }
      }

      if (trigger === "update") {
        token.name = session.user.name
      }

      return token;
    },

    async authorized({request, auth}) {
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
