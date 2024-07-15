// src/middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Logging the path for debugging

  // Allow access to authentication-related API routes even if the user is not authenticated
  if (!user && path.startsWith("/api/auth")) {
    console.log("not authenticated but accessing auth route");
    return NextResponse.next();
  }

  // Redirect unauthenticated users trying to access protected routes to the login page
  if (!user) {
    console.log("not authenticated");
    if(path.startsWith("/api")) {
      console.log("not authenticated but accessing api route");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect authenticated users trying to access the login page to the dashboard
  if (user && path === "/login") {
    console.log("authenticated but accessing login page");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Allow access to other routes
  console.log("authenticated");
  return NextResponse.next();
}

// Apply the middleware to relevant routes
export const config = {
  matcher: ["/dashboard/parts", "/" , "/api/register" , "/api/checkUser" , "/api/users"],
};
