import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [rows]: any = await db.execute(
      'SELECT shop_name, email, bio, location, operational_hours FROM users WHERE email = ?',
      [session.user.email]
    );
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil profil" }, { status: 500 });
  }
}