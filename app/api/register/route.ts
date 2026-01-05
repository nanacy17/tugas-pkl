// src/app/api/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db'; 
import { RowDataPacket } from 'mysql2';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Semua field wajib diisi.' }, { status: 400 });
    }

    // Cek user sudah ada
    const [existingUser] = await db.execute<RowDataPacket[]>('SELECT email FROM users WHERE email = ?', [email]);
    
    if (existingUser.length > 0) {
      return NextResponse.json({ message: 'Email sudah terdaftar.' }, { status: 409 });
    }

    // Hash Password & Simpan
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await db.execute(
      'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
      [userId, name, email, hashedPassword]
    );

    return NextResponse.json(
      { message: 'Pendaftaran berhasil. Silakan masuk.' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error saat pendaftaran:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}