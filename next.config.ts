import { execSync } from "node:child_process";
import type { NextConfig } from "next";

/**
 * Die Build-ID muss über zwei aufeinanderfolgende Builds gleich bleiben.
 * Next erzeugt sie sonst zufällig, und weil sie im Hydrations-Payload jeder
 * Seite steht, ändern sich mit ihr die CSP-Hashes aus scripts/csp-hashes.mjs
 * bei jedem Build. Gebunden an den Commit ist sie reproduzierbar.
 */
function buildKennung(): string {
	const vonVercel = process.env["VERCEL_GIT_COMMIT_SHA"];
	if (vonVercel) return vonVercel.slice(0, 20);
	try {
		return execSync("git rev-parse HEAD", { encoding: "utf8" })
			.trim()
			.slice(0, 20);
	} catch {
		return "lokal-ohne-git";
	}
}

/**
 * Feste Sicherheits-Antwort-Header.
 * Die Content-Security-Policy steht nicht hier, sondern in src/proxy.ts:
 * sie unterscheidet sich je Seite, weil sie die Inline-Skripte dieser Seite
 * per Hash freigibt.
 */
const sicherheitsHeader = [
	{
		key: "Strict-Transport-Security",
		value: "max-age=63072000; includeSubDomains; preload",
	},
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "X-Frame-Options", value: "DENY" },
	{ key: "Referrer-Policy", value: "no-referrer" },
	{
		key: "Permissions-Policy",
		value:
			"camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
	},
	{ key: "Cross-Origin-Opener-Policy", value: "same-origin" },
	{ key: "Cross-Origin-Resource-Policy", value: "same-origin" },
	{ key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
];

const nextConfig: NextConfig = {
	generateBuildId: buildKennung,
	reactStrictMode: true,
	poweredByHeader: false,
	trailingSlash: false,
	// Bilder werden nach Entscheidung des Inhabers nicht über next/image
	// ausgeliefert, sondern als eigenes <picture>-Markup mit zur Bauzeit
	// erzeugten AVIF- und WebP-Varianten: next/image setzt Inline-Styles, die
	// die Content-Security-Policy nicht erlaubt.
	images: { unoptimized: true },
	/**
	 * Reichweitenmessung über den eigenen Origin (src/lib/analyse.ts). Ohne
	 * UMAMI_HOST gibt es keine Weiterleitung, und /stats liefert 404.
	 */
	async rewrites() {
		const umami = process.env["UMAMI_HOST"];
		if (!umami) return [];
		return [{ source: "/stats/:pfad*", destination: `${umami.replace(/\/$/, "")}/:pfad*` }];
	},
	async headers() {
		return [
			{ source: "/:path*", headers: sicherheitsHeader },
			{
				source: "/.well-known/security.txt",
				headers: [
					{ key: "Content-Type", value: "text/plain; charset=utf-8" },
				],
			},
			{
				source: "/fonts/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
		];
	},
};

export default nextConfig;
