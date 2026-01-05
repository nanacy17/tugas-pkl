import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// --- 1. AMBIL DAFTAR BARANG (Urutan Terbaru di Atas) ---
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Cek apakah user sudah login
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query SQL: Mengambil barang milik user yang sedang login
    // ORDER BY created_at DESC membuat barang terbaru muncul di paling atas
    const query = `
      SELECT * FROM products 
      WHERE seller_email = ? 
      ORDER BY created_at DESC
    `;

    const [rows]: any = await db.query(query, [session.user.email]);

    return NextResponse.json(rows || []);
  } catch (error: any) {
    console.error("🔥 ERROR GET PRODUCTS:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- 2. SIMPAN BARANG BARU ---
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Silakan login ulang" }, { status: 401 });
    }

    const body = await req.json();
    const { name, price, category, description, image_url } = body;

    // Pastikan data minimal terisi
    if (!name || !price) {
      return NextResponse.json({ error: "Nama dan Harga wajib diisi" }, { status: 400 });
    }

    // Query SQL: Menggunakan 'seller_email' sesuai struktur tabel kamu
    // Kolom 'status' otomatis kita set 'Tersedia'
    const query = `
      INSERT INTO products (name, price, category, description, status, seller_email, image_url) 
      VALUES (?, ?, ?, ?, 'Tersedia', ?, ?)
    `;

    // Urutan values harus SAMA dengan urutan kolom di query INSERT di atas
    const values = [
      name,
      price,
      category || "Umum",
      description || "",
      session.user.email, // Masuk ke kolom seller_email
      image_url || ""
    ];

    await db.query(query, values);

    return NextResponse.json({ message: "Barang berhasil ditambahkan" }, { status: 201 });

  } catch (error: any) {
    console.error("🔥 ERROR POST PRODUCTS:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}