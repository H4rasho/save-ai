import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Proteger todas las rutas dentro de (auth)
const protectedRoutes = createRouteMatcher([
	"/dashboard(.*)",
	"/home(.*)",
	"/movements(.*)",
	"/profile(.*)",
	"/welcome(.*)",
]);

// Rutas que deberían redirigir a /home si el usuario ya está autenticado
const redirectIfAuthenticatedRoutes = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
	const { userId } = await auth();
	const url = req.nextUrl.clone();

	// Si la ruta está protegida, verificar autenticación
	if (protectedRoutes(req)) {
		// Si no está autenticado, Clerk manejará la redirección al login
		await auth.protect();
	}

	// Si el usuario está autenticado y está intentando acceder a rutas que deberían redirigir
	if (userId && redirectIfAuthenticatedRoutes(req)) {
		console.log("Redirigiendo a /home");
		url.pathname = "/home";
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
