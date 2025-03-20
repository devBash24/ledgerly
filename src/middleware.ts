import { clerkMiddleware, createRouteMatcher, currentUser } from "@clerk/nextjs/server";
import api from "./lib/axios";
import { redirect } from "next/navigation";



const isPublicRoute = createRouteMatcher(["/", "/sign-in", "/sign-up",]);
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/onboarding(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const {userId,redirectToSignIn} = await auth()
  if(!isPublicRoute(req)) {
    if(!userId){
      return redirectToSignIn({returnBackUrl:req.nextUrl.pathname})
    }
    if(isProtectedRoute(req)){
      if(!userId){
        return redirectToSignIn({returnBackUrl:req.nextUrl.pathname})
      }
    }
  }
})


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}