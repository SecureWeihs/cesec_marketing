/**
 * Laufende Prüfung nach Abschnitt 14.6 des Briefs.
 *
 * Prüft eine laufende Instanz gegen die verbindlichen Vorgaben:
 *   1. alle Antwort-Header aus Abschnitt 14.1, mit exaktem Wert
 *   2. Content-Security-Policy ohne 'unsafe-inline' und ohne 'unsafe-eval'
 *   3. jedes Inline-Skript im ausgelieferten HTML ist per Hash gedeckt
 *   4. keine Ressource von einem fremden Host (Abnahmekriterium 3)
 *   5. genau eine E-Mail-Adresse unter cesec.at (Abnahmekriterium 17)
 *   6. security.txt erreichbar und gültig (Abschnitt 14.3)
 *
 * Aufruf: node scripts/pruefe-header.mjs https://cesec.at [weitere Pfade …]
 */
import { createHash } from "node:crypto";

const basis = (process.argv[2] ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const pfade = process.argv.length > 3 ? process.argv.slice(3) : ["/"];

/** Erlaubte Hosts für Ressourcen: ausschließlich der eigene Origin. */
const RESSOURCEN_ATTRIBUTE = /(?:\bsrc|\bhref)="([^"]+)"/g;
/** Nur <link>-Typen, die tatsächlich eine Ressource laden. */
const LADENDE_LINKS =
	/<link\b[^>]*\brel="(?:stylesheet|preload|modulepreload|prefetch|icon|shortcut icon|apple-touch-icon|manifest)"[^>]*>/g;

const pflichtHeader = {
	"strict-transport-security":
		"max-age=63072000; includeSubDomains; preload",
	"x-content-type-options": "nosniff",
	"x-frame-options": "DENY",
	"referrer-policy": "no-referrer",
	"permissions-policy":
		"camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
	"cross-origin-opener-policy": "same-origin",
	"cross-origin-resource-policy": "same-origin",
	"cross-origin-embedder-policy": "require-corp",
};

const fehler = [];
const meldung = (pfad, text) => fehler.push(`${pfad}: ${text}`);

function hashe(inhalt) {
	return `'sha256-${createHash("sha256").update(inhalt, "utf8").digest("base64")}'`;
}

for (const pfad of pfade) {
	const antwort = await fetch(`${basis}${pfad}`, { redirect: "manual" });

	if (antwort.status !== 200) {
		meldung(pfad, `Status ${antwort.status} statt 200`);
		continue;
	}

	for (const [name, erwartet] of Object.entries(pflichtHeader)) {
		const ist = antwort.headers.get(name);
		if (ist === null) meldung(pfad, `Header ${name} fehlt`);
		else if (ist !== erwartet)
			meldung(pfad, `Header ${name}: "${ist}" statt "${erwartet}"`);
	}

	const csp = antwort.headers.get("content-security-policy");
	if (!csp) {
		meldung(pfad, "Content-Security-Policy fehlt");
		continue;
	}
	for (const verboten of ["'unsafe-inline'", "'unsafe-eval'", "*"]) {
		if (csp.includes(verboten))
			meldung(pfad, `CSP enthält ${verboten}`);
	}
	for (const direktive of [
		"default-src 'none'",
		"style-src 'self'",
		"base-uri 'none'",
		"frame-ancestors 'none'",
		"object-src 'none'",
	]) {
		if (!csp.includes(direktive)) meldung(pfad, `CSP ohne "${direktive}"`);
	}

	const html = await antwort.text();

	const gedeckt = new Set(csp.match(/'sha256-[^']+'/g) ?? []);
	const inline =
		html.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g) ?? [];
	for (const block of inline) {
		const inhalt = block.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
		if (!gedeckt.has(hashe(inhalt)))
			meldung(pfad, "Inline-Skript ist nicht per Hash gedeckt");
	}

	// Ressourcenverweise: <script src>, <link href>, <img src>. Reine
	// Textlinks (<a href>) dürfen selbstverständlich nach außen zeigen.
	const ressourcen = [
		...(html.match(/<script\b[^>]*\bsrc="([^"]+)"/g) ?? []),
		...(html.match(LADENDE_LINKS) ?? []),
		...(html.match(/<img\b[^>]*\bsrc="([^"]+)"/g) ?? []),
	];
	for (const treffer of ressourcen) {
		for (const [, wert] of treffer.matchAll(RESSOURCEN_ATTRIBUTE)) {
			if (/^https?:\/\//i.test(wert) && !wert.startsWith(`${basis}/`))
				meldung(pfad, `Ressource von fremdem Host: ${wert}`);
		}
	}

	const adressen = new Set(html.match(/[\w.+-]+@cesec\.at/g) ?? []);
	adressen.delete("sw@cesec.at");
	if (adressen.size > 0)
		meldung(pfad, `weitere E-Mail-Adressen: ${[...adressen].join(", ")}`);
}

const sec = await fetch(`${basis}/.well-known/security.txt`);
if (!sec.ok) {
	meldung("/.well-known/security.txt", `Status ${sec.status}`);
} else {
	const text = await sec.text();
	for (const feld of ["Contact:", "Expires:", "Canonical:"]) {
		if (!text.includes(feld))
			meldung("/.well-known/security.txt", `Feld ${feld} fehlt`);
	}
	const ablauf = text.match(/^Expires:\s*(.+)$/m)?.[1];
	if (ablauf && new Date(ablauf) < new Date())
		meldung("/.well-known/security.txt", `abgelaufen am ${ablauf}`);
}

if (fehler.length > 0) {
	console.error(`Prüfung gegen ${basis} fehlgeschlagen:\n`);
	for (const zeile of fehler) console.error(`  ✗ ${zeile}`);
	process.exit(1);
}

console.log(
	`Prüfung gegen ${basis} bestanden: ${pfade.length} Seite(n), alle Header, CSP, Hashes, Hosts, E-Mail-Adresse und security.txt.`,
);
