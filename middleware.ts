import { NextRequest, NextResponse } from 'next/server';

export const config = {
    matcher: [
        '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
    ],
};

export default async function middleware(req: NextRequest) {
    const hostname = req.headers.get('host');
    console.log("hostname----->", hostname)
    const url = req.nextUrl;
    console.log("url----->", url)

    const searchParams = req.nextUrl.searchParams.toString();
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;
    console.log("path-->", path)

    if (hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
        return NextResponse.rewrite(new URL(`/home${path === '/' ? '' : path}`, req.url));
    }

    const session = true;

    if (!session && hostname !== `auth.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
        return NextResponse.redirect(new URL(`${process.env.HTTP_PROTOCOL}://auth.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`));
    }

    if (hostname === `auth.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
        return NextResponse.rewrite(new URL(`/auth${path === '/' ? '' : path}`, req.url));
    }

    if (hostname === `admin.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
        return NextResponse.rewrite(
            new URL(`/admin${path === '/' ? '' : path}`, req.url)
        );
    }

    return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}