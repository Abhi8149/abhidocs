import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request:NextRequest){
    const pathname=request.nextUrl.pathname;
    const token=await getToken({req:request});

    const publicPages=['/','/register','/login','/verify'];
    const isPublicPage=publicPages.includes(pathname);

    const isDocumentPage=pathname.startsWith('/document');

    const isProtectedPage=pathname==='/dashboard' || isDocumentPage

    if(token && isPublicPage){
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if(!token && isProtectedPage){
        return NextResponse.redirect(new URL('/register', request.url))
    }

    return NextResponse.next();
}

export const config={
    matcher:['/','/register', '/login', '/verify', '/dashboard', '/document/:path*']
}