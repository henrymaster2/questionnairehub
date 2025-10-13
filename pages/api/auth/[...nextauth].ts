// pages/api/auth/[...nextauth].ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import type { JWT } from "next-auth/jwt";
import type { User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      isAdmin: boolean;
      phone?: string;
    } & Omit<User, "id">;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    isAdmin: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email or Phone",
          type: "text",
          placeholder: "Email or Phone",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null;
          const { identifier, password } = credentials;

          // Admin credentials from environment
          const adminEmail = process.env.ADMIN_EMAIL;
          const adminPassword = process.env.ADMIN_PASSWORD;
          const adminId = Number(process.env.ADMIN_ID ?? -1);

          // Check if admin is logging in
          if (identifier === adminEmail && password === adminPassword) {
            return {
              id: adminId.toString(),
              name: "Admin",
              email: adminEmail ?? "",
              isAdmin: true,
            };
          }

          // Regular user login
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: identifier.toLowerCase() },
                { phone: identifier },
              ],
            },
          });

          if (!user) return null;

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return null;

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: false,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as unknown as {
          id: string | number;
          isAdmin?: boolean;
        };
        token.id = typeof typedUser.id === "string" ? parseInt(typedUser.id, 10) : typedUser.id;
        token.isAdmin = typedUser.isAdmin ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
