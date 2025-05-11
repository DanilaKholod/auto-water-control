import { NextRequest } from "next/server";
import { createCorsMiddleware } from "next-armored/cors";

const corsMiddleware = createCorsMiddleware({
    origins: ["http://194.226.121.145:8080"],
});

export function middleware(request: NextRequest) {
    return corsMiddleware(request);
}

export const config = {
    matcher: ["/api/:path*"],
};