import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout berhasil' });
  
  // Hapus cookie sesi
  response.cookies.delete('admin_session');
  
  return response;
}