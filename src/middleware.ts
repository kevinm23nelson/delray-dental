// src/middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    req: NextRequest
  ) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === "ADMIN"
    },
  }
)

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/calendar/:path*",
    "/admin/employees/:path*",
    "/admin/patients/:path*",
  ]
}