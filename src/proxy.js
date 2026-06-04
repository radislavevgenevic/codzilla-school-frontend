import { NextResponse } from "next/server";

const protectedPaths = [
  "/profile",
  "/profile/panel",
  "/profile/attendance",
  "/profile/students",
  "/profile/users",
  "/profile/courses",
];

const isProtectedPath = (pathname) => {
  return protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
};

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
