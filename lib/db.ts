// lib/db.ts
import mysql from 'mysql2/promise';

// Tambahkan kata 'export' di depan const
export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // sesuaikan password database kamu
  database: 'next_auth',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});