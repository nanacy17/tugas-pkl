// lib/db.ts
import mysql from 'mysql2/promise';

// Tambahkan kata 'export' di depan const
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 17312,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  ssl: {
    rejectUnauthorized: false,
  },
});