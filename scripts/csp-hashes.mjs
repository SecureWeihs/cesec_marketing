/**
 * Erzeugt die SHA-256-Hashes aller Inline-Skripte, die Next.js in das
 * vorgerenderte HTML schreibt, und legt sie als Landkarte Pfad → Hashes ab.
 *
 * Hintergrund: Verlangt sind statisch erzeugte Seiten und eine
 * Content-Security-Policy ohne 'unsafe-inline'. Eine Nonce
 * kann beides nicht zugleich erfüllen, weil sie pro Antwort neu erzeugt und
 * dafür in das HTML geschrieben werden müsste — was serverseitiges Rendern bei
 * jedem Aufruf erzwingt. Hashes lösen das: sie stehen zur Bauzeit fest, die
 * Seiten bleiben statisch, und 'unsafe-inline' bleibt draußen.
 *
 * Aufruf:
 *   node scripts/csp-hashes.mjs           schreibt die Landkarte
 *   node scripts/csp-hashes.mjs --verify  prüft, ob sie zum Build passt
 */
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const HTML_WURZEL = ".next/server/app";
const ZIEL = "src/generated/csp-hashes.json";
// Groß-/Kleinschreibung und Leerraum im schließenden Tag spielen für den
// Browser keine Rolle, also auch nicht für diese Erkennung. Derselbe Ausdruck
// steht in scripts/pruefe-header.mjs.
const INLINE_SKRIPT = /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script\s*>/gi;

async function htmlDateien(verzeichnis) {
	const gefunden = [];
	for (const eintrag of await readdir(verzeichnis, { withFileTypes: true })) {
		const pfad = join(verzeichnis, eintrag.name);
		if (eintrag.isDirectory()) gefunden.push(...(await htmlDateien(pfad)));
		else if (eintrag.name.endsWith(".html")) gefunden.push(pfad);
	}
	return gefunden;
}

/** `.next/server/app/foo/index.html` → `/foo`, `…/app/index.html` → `/` */
function routeAus(dateipfad) {
	const rel = relative(HTML_WURZEL, dateipfad).split(sep).join("/");
	const ohneEndung = rel.replace(/\.html$/, "").replace(/\/?index$/, "");
	return `/${ohneEndung}`.replace(/\/{2,}/g, "/");
}

function hashe(inhalt) {
	return `'sha256-${createHash("sha256").update(inhalt, "utf8").digest("base64")}'`;
}

const landkarte = {};
for (const datei of await htmlDateien(HTML_WURZEL)) {
	const html = await readFile(datei, "utf8");
	const hashes = [...html.matchAll(INLINE_SKRIPT)].map((treffer) =>
		hashe(treffer[1]),
	);
	if (hashes.length > 0) landkarte[routeAus(datei)] = [...new Set(hashes)];
}

const inhalt = `${JSON.stringify(landkarte, null, "\t")}\n`;
const anzahl = Object.values(landkarte).flat().length;

if (process.argv.includes("--verify")) {
	const bestand = await readFile(ZIEL, "utf8").catch(() => "");
	if (bestand !== inhalt) {
		console.error(
			"csp-hashes: Die Hashes passen nicht mehr zum Build.\n" +
				"Das darf nicht ins Deployment: die CSP würde die eigenen Skripte blockieren.",
		);
		process.exit(1);
	}
	console.log(`csp-hashes: ${anzahl} Hashes geprüft, Landkarte ist aktuell.`);
} else {
	await writeFile(ZIEL, inhalt, "utf8");
	console.log(
		`csp-hashes: ${anzahl} Hashes aus ${Object.keys(landkarte).length} Seiten geschrieben.`,
	);
}
