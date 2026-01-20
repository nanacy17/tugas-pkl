import mysql from 'mysql2/promise';

console.log("Mencoba koneksi ke host:", process.env.DB_HOST); // Ini akan muncul di log Vercel

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'HOST_TIDAK_TERBACA', 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 17312,
  ssl: {
    rejectUnauthorized: false,
  },
});