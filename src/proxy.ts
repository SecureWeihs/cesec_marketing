import { NextResponse, type NextRequest } from "next/server";
import hashLandkarte from "@/generated/csp-hashes.json";
import { MTA_STS_HOST, MTA_STS_PFAD, richtlinie as mtaStsRichtlinie } from "@/lib/mta-sts";

/**
 * Content-Security-Policy, seitenweise.
 *
 * Bewusst kein Nonce-Verfahren, obwohl Next.js dafür ausgelegt ist. Eine Nonce muss pro Antwort neu erzeugt und in das HTML
 * geschrieben werden und erzwingt damit serverseitiges Rendern bei jedem
 * Aufruf — im Widerspruch zu statisch erzeugten Seiten. Stattdessen werden die Inline-Skripte von Next.js zur Bauzeit
 * gehasht (scripts/csp-hashes.mjs). Ergebnis: Seiten bleiben statisch,
 * 'unsafe-inline' und 'unsafe-eval' bleiben draußen, und der Hash bindet
 * die Erlaubnis an genau diesen einen Skriptinhalt — enger als eine Nonce,
 * die jeden Inhalt erlaubt, der sie trägt.
 *
 * 'strict-dynamic' wird bewusst nicht gesetzt: es würde die regulären
 * <script src>-Verweise auf die eigenen Chunks entwerten, die Next.js
 * statisch in das HTML schreibt.
 */

const landkarte = hashLandkarte as Record<string, string[] | undefined>;
const alleHashes = [...new Set(Object.values(landkarte).flat())].filter(
	(hash): hash is string => typeof hash === "string",
);

function hashesFuer(pfad: string): string[] {
	const genau = landkarte[pfad];
	if (genau) return genau;
	// Unbekannter Pfad, etwa eine Weiterleitung auf die 404-Seite: die
	// Vereinigungsmenge erlaubt ausschließlich eigene, zur Bauzeit bekannte
	// Skriptinhalte und bleibt damit im selben Vertrauensrahmen.
	return alleHashes;
}

function richtlinie(pfad: string, entwicklung: boolean): string {
	const skript = entwicklung
		? // Nur lokal: der Entwicklungsserver von Next braucht eval und wechselnde
			// Inline-Skripte für Hot Reload. Im Produktionsbuild gilt ausschließlich
			// der Hash-Zweig darunter, geprüft im CI gegen die Produktions-URL.
			"'self' 'unsafe-inline' 'unsafe-eval'"
		: ["'self'", ...hashesFuer(pfad)].join(" ");

	return [
		"default-src 'none'",
		`script-src ${skript}`,
		"style-src 'self'",
		"img-src 'self' data:",
		"font-src 'self'",
		entwicklung ? "connect-src 'self' ws:" : "connect-src 'self'",
		"form-action 'self'",
		"base-uri 'none'",
		"frame-ancestors 'none'",
		"object-src 'none'",
		"manifest-src 'self'",
		"upgrade-insecure-requests",
	].join("; ");
}

/**
 * mta-sts.cesec.at trägt ausschließlich die MTA-STS-Richtlinie (RFC 8461).
 *
 * Alles andere wird auf den kanonischen Host umgeleitet: Wäre die Website unter
 * einem zweiten Namen erreichbar, stünde sie doppelt im Index — derselbe
 * Fehler, der schon einmal die kanonischen Verweise gekostet hat.
 *
 * Die Richtliniendatei selbst darf dabei niemals weitergeleitet werden:
 * RFC 8461, Abschnitt 3.3 verbietet absendenden Servern ausdrücklich, einer
 * Weiterleitung zu folgen. Sie wird deshalb hier direkt beantwortet, mit
 * text/plain und ohne jede Abhängigkeit vom Seitenaufbau.
 */
function mtaSts(request: NextRequest): NextResponse {
	if (request.nextUrl.pathname === MTA_STS_PFAD) {
		return new NextResponse(mtaStsRichtlinie(), {
			status: 200,
			headers: {
				"content-type": "text/plain; charset=utf-8",
				"cache-control": "public, max-age=3600",
				"content-security-policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
				"x-robots-tag": "noindex",
			},
		});
	}
	const ziel = new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, "https://cesec.at");
	return NextResponse.redirect(ziel, 308);
}

export function proxy(request: NextRequest): NextResponse {
	const entwicklung = process.env.NODE_ENV === "development";

	// Maßgeblich ist der Host-Header, nicht nextUrl: hinter dem CDN trägt nur er
	// den vom Besucher tatsächlich aufgerufenen Namen.
	const host = (request.headers.get("host") ?? "").toLowerCase().split(":")[0] ?? "";
	if (host === MTA_STS_HOST) return mtaSts(request);

	const antwort = NextResponse.next();
	antwort.headers.set(
		"content-security-policy",
		richtlinie(request.nextUrl.pathname, entwicklung),
	);
	return antwort;
}

export const config = {
	/*
	 * Statische Dateien brauchen keine CSP; die übrigen Sicherheitsheader aus
	 * next.config.ts gelten dort trotzdem.
	 */
	matcher: ["/((?!_next/static|_next/image|fonts|favicon.ico).*)"],
};
