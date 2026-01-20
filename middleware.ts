// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// // Fungsi middleware ini akan dijalankan untuk setiap request
// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('session')?.value

//   // Contoh: Jika user mencoba masuk ke /dashboard tanpa token
//   if (request.nextUrl.pathname.startsWith('/dashboard')) {
//     if (!token) {
//       // Redirect ke halaman login
//       return NextResponse.redirect(new URL('/login', request.url))
//     }
//   }

//   // Jika semua oke, lanjut ke proses berikutnya
//   return NextResponse.next()
// }

// // Menentukan rute mana saja yang akan diperiksa oleh middleware
// export const config = {
//   matcher: ['/dashboard/:path*', '/profile/:path*'],
// }