import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    debug: true,
    publicRoutes: [
        "/api/webhook(.*)",
        '/',
        '/event/:id',
        '/api/webhook/stripe',
        '/api/webhook/clerk',
        '/api/uploadthing'
    ],
    ignoredRoutes: [
        '/api/webhook/stripe',
        '/api/webhook/clerk',
        '/api/uploadthing'
    ]
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};