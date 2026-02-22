// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";

// // This function can be marked `async` if using `await` inside
// export async function middleware(request) {
//   const userInfo = await getToken({
//     req: request,
//     // NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
//   });

//   if (!userInfo) {
//     return NextResponse.redirect(new URL(`/auth/login`, request.url));
//   }

//   return NextResponse.next();
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: [
//     // "/user/:path*",
//     // "/order/:path*",
//     // "/checkout/:path*",
//     // "/auth/login/:path*",
//   ],
// };
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// ...existing code...
export async function middleware(request) {
  try {
    const userInfo = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET, // ensure this is set in production
    });

    if (!userInfo) {
      return NextResponse.redirect(new URL(`/auth/login`, request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware getToken error:", err);
    return NextResponse.redirect(new URL(`/auth/login`, request.url));
  }
}
// ...existing code...
export const config = {
  matcher: [
    // "/user/:path*",
    // "/order/:path*",
    // "/checkout/:path*",
    // "/auth/login/:path*",
  ],
};
