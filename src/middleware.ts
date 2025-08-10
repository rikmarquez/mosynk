import { auth } from "@/lib/auth"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = nextUrl.pathname === "/" || 
                       nextUrl.pathname.startsWith("/auth/")
  const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard") ||
                          nextUrl.pathname.startsWith("/models/")

  // Allow all API auth routes
  if (isApiAuthRoute) {
    return
  }

  // Allow public routes
  if (isPublicRoute) {
    return
  }

  // Redirect to login if not authenticated and trying to access protected route
  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL("/auth/login", nextUrl))
  }

  return
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}