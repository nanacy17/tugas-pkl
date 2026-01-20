import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db"; 
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const [rows]: any = await db.query("SELECT * FROM users WHERE email = ?", [credentials.email]);
          const user = rows[0];

          if (!user) {
            console.log("❌ User tidak ditemukan");
            return null;
          }

          const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

          if (isPasswordMatch) {
            console.log("✅ Login Berhasil");
            // Kembalikan objek yang bersih
            return { 
              id: user.id.toString(), 
              name: user.name, 
              email: user.email 
            };
          } else {
            console.log("❌ Password salah");
            return null;
          }
        } catch (error) {
          console.error("🔥 Error di Authorize:", error);
          throw new Error("Internal Server Error"); // Lempar error agar ditangkap NextAuth
        }
      }
    })
  ],
  // --- TAMBAHKAN BAGIAN INI ---
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  // ----------------------------
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  pages: {
    signIn: "/login", // Pastikan mengarah ke route login kamu
  },
  secret: process.env.NEXTAUTH_SECRET,
};