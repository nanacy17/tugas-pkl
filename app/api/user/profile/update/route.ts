import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { shop_name, bio, location, operational_hours } = await req.json();

    await db.execute(
      'UPDATE users SET shop_name = ?, bio = ?, location = ?, operational_hours = ? WHERE email = ?',
      [shop_name, bio, location, operational_hours, session.user.email]
    );

    return NextResponse.json({ message: "Profil berhasil diperbarui" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal" }, { status: 500 });
  }
}