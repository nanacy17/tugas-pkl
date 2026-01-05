import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json(); // Mengambil 'Terjual' atau 'Tersedia'
    const { id } = await params; // Next.js 15 wajib await params
    const userEmail = session.user.email;

    // Update status barang milik user yang login
    const [result]: any = await db.execute(
      "UPDATE products SET status = ? WHERE id = ? AND seller_email = ?",
      [status, id, userEmail]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Gagal memperbarui status" }, { status: 404 });
    }

    return NextResponse.json({ message: "Status diperbarui" });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}