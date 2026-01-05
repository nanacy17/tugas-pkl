// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db"; 
import bcrypt from "bcrypt"; // Import ini!

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

          // BANDINGKAN PASSWORD PAKAI BCRYPT
          const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

          if (isPasswordMatch) {
            console.log("✅ Login Berhasil (Bcrypt Match)");
            return { 
              id: user.id.toString(), 
              name: user.name, 
              email: user.email 
            };
          } else {
            console.log("❌ Password salah (Bcrypt Mismatch)");
            return null;
          }
        } catch (error) {
          console.error("🔥 Error saat login:", error);
          return null;
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};