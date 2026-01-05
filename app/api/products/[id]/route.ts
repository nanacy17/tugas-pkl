import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// --- FUNGSI UPDATE STATUS (PATCH) ---
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { status } = await req.json();
    const { id } = await params; // Wajib await untuk Next.js 15
    const email = session.user.email;

    const [result]: any = await db.execute(
      "UPDATE products SET status = ? WHERE id = ? AND seller_email = ?",
      [status, id, email]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Gagal update: Barang tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Status diperbarui" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- FUNGSI HAPUS (DELETE) ---
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const email = session.user.email;

    const [result]: any = await db.execute(
      "DELETE FROM products WHERE id = ? AND seller_email = ?",
      [id, email]
    );

    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- FUNGSI UPDATE FULL DATA (PUT) ---
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, price, category, description, status } = await req.json();
    const { id } = await params;
    const email = session.user.email;

    // Pastikan price dikonversi ke Number agar tidak error di database
    const [result]: any = await db.execute(
      "UPDATE products SET name = ?, price = ?, category = ?, description = ?, status = ? WHERE id = ? AND seller_email = ?",
      [name, Number(price), category, description, status, id, email]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Gagal update: Barang tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Produk berhasil diperbarui" });
  } catch (error: any) {
    console.error("Database Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}