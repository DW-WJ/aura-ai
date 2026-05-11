import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateUniqueSlug } from "@/lib/auth-workspace";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) session.user.id = token.id as string;
      return session;
    },
    async signIn({ user }) {
      // Google OAuth 用户首次登录时自动创建个人工作空间
      if (user.email && !user.id?.match(/^[0-9a-f]{24}$/)) return true;
      try {
        const existing = await prisma.workspaceMember.findFirst({
          where: { userId: user.id as string },
        });
        if (!existing) {
          const name = user.name || user.email?.split("@")[0] || "My Workspace";
          const slug = await generateUniqueSlug(name);
          const ws = await prisma.workspace.create({
            data: { name, slug, plan: "free" },
          });
          await prisma.workspaceMember.create({
            data: { workspaceId: ws.id, userId: user.id as string, role: "owner" },
          });
        }
      } catch (e) {
        console.error("Workspace creation error:", e);
      }
      return true;
    },
  },
});

const { GET, POST } = handlers;
export { GET, POST };