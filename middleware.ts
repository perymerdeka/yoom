import {clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export default clerkMiddleware((auth, req) => {
    if (protectedRoutes(req)) auth().protect();
});

const protectedRoutes = createRouteMatcher([
    "/",
    "/upcoming",
    "/previous",
    "/personal-room",
    "/recordings",
    "/meeting(.*)"
]);


export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};