import { NextRequest, NextResponse } from "next/server";
import { auth } from "./app/api/auth/[...nextauth]/options";

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/sign-in",
		"/sign-up",
		"/",
		"/verify/:path*",
	],
};

export async function middleware(request: NextRequest) {
	const session = await auth();
	//const token = await getToken({ req: request });
	const url = request.nextUrl;

	// Redirect to dashboard if the user is already authenticated
	// and trying to access sign-in, sign-up, or home page
	if (
		session &&
		(url.pathname.startsWith("/sign-in") ||
			url.pathname.startsWith("/sign-up") ||
			url.pathname.startsWith("/verify") ||
			url.pathname === "/")
	) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	if (!session && url.pathname.startsWith("/dashboard")) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	return NextResponse.next();
}
