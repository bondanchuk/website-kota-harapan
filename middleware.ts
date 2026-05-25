// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Deteksi apakah rute saat ini adalah halaman admin (kecuali login)
const isProtectedRoute = path.startsWith('/admin') && path !== '/auth';  
  // Cek apakah ada cookie sesi
  const session = request.cookies.get('admin_session')?.value;

  // Jika mencoba akses dashboard tapi TIDAK ADA sesi, tendang ke login
if (isProtectedRoute && !session) {
  return NextResponse.redirect(new URL('/auth', request.url));
}

if (path === '/auth' && session) {
  return NextResponse.redirect(new URL('/admin/dashboard', request.url));
}

  const response = NextResponse.next();

  // KUNCI TOMBOL BACK BROWSER: Matikan cache untuk halaman terproteksi
  if (isProtectedRoute) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  }

  return response;
}

// Tentukan rute mana saja yang akan dijaga oleh middleware ini
export const config = {
  matcher: ['/admin/:path*'],
};