import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Opción 1: Export como función nombrada
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Opción 2: Si prefieres export default, asegúrate de que esté bien estructurado
// export default function middleware(request: NextRequest) {
//   return NextResponse.next();
// }

// Configuración del matcher (opcional pero recomendado)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}