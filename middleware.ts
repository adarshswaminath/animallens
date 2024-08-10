import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check for any Firebase auth cookies
  const authCookie = request.cookies.get("firebase-auth-token")?.value;
  console.log(authCookie);
  // If there's no auth cookie and the user is trying to access /profile or /image-upload
  if (
    !authCookie &&
    (request.nextUrl.pathname === "/profile" ||
      request.nextUrl.pathname === "/image-upload")
  ) {
    // Redirect to the home page
    return NextResponse.redirect(new URL("/", request.url));
  }


  // For all other cases, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/image-upload"],
};
