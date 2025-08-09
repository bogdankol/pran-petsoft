import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth

// export default function middleware() {
//   return NextResponse.next()
// }

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};