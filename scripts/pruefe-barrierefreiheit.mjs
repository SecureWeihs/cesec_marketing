/**
 * Prüft die ausgelieferten Seiten mit axe-core gegen WCAG 2.1 A und AA.
 *
 * Automatische Werkzeuge finden nur einen Teil der möglichen Barrieren —
 * grob geschätzt ein Drittel. Sie ersetzen die Prüfung mit Tastatur und
 * Screenreader nicht, fangen aber alles ab, was sich mechanisch feststellen
 * lässt: fehlende Alternativtexte, zu schwache Kontraste, kaputte
 * Überschriftenhierarchien, Formularfelder ohne Beschriftung.
 *
 * Braucht einen installierten Chrome. Pfad über CHROME_PATH, sonst werden die
 * üblichen Orte durchsucht. Ohne Chrome bricht die Prüfung in der CI ab und
 * wird lokal mit Hinweis übersprungen.
 *
 * Aufruf: node scripts/pruefe-barrierefreiheit.mjs http://127.0.0.1:3000 / /impressum
 */
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import puppeteer from "puppeteer-core";

/*
 * axe-core wird direkt in die Seite eingespielt, statt über den Adapter
 * @axe-core/puppeteer. Der Adapter zieht das vollständige puppeteer nach sich,
 * dessen Installationsskript einen eigenen Chrome herunterlädt — den wir nicht
 * brauchen, weil der im System vorhandene verwendet wird, und den die Vorgabe
 * zu Abhängigkeiten ohnehin ausschließt. Der Adapter spart genau die zehn
 * Zeilen darunter.
 */
const axeQuelle = await readFile(
	createRequire(import.meta.url).resolve("axe-core/axe.min.js"),
	"utf8",
);

const basis = (process.argv[2] ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const pfade = process.argv.length > 3 ? process.argv.slice(3) : ["/"];

const ORTE = [
	process.env["CHROME_PATH"],
	"/usr/bin/google-chrome",
	"/usr/bin/google-chrome-stable",
	"/usr/bin/chromium",
	"/usr/bin/chromium-browser",
	"/snap/bin/chromium",
].filter((ort) => typeof ort === "string" && ort.length > 0);

const chrome = ORTE.find((ort) => existsSync(ort));

if (!chrome) {
	const meldung =
		"Kein Chrome gefunden. Pfad über CHROME_PATH setzen oder Chrome installieren.";
	if (process.env["CI"]) {
		console.error(`Barrierefreiheitsprüfung: ${meldung}`);
		process.exit(1);
	}
	console.warn(`Barrierefreiheitsprüfung übersprungen. ${meldung}`);
	process.exit(0);
}

// Erst prüfen, ob überhaupt jemand antwortet: ein stehender Browser, der in
// einen Zeitüberlauf läuft, sagt nichts darüber aus, was kaputt ist.
const probe = await fetch(`${basis}/`).catch((ursache) => ursache);
if (!(probe instanceof Response) || !probe.ok) {
	console.error(
		`Barrierefreiheitsprüfung: ${basis} antwortet nicht (${probe instanceof Response ? probe.status : probe.message}).`,
	);
	process.exit(1);
}

const browser = await puppeteer.launch({
	executablePath: chrome,
	args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

let verstoesse = 0;

try {
	for (const pfad of pfade) {
		const seite = await browser.newPage();
		const konsole = [];
		seite.on("console", (nachricht) => {
			// Die Konsolenmeldung allein nennt die Adresse nicht; die kommt aus
			// den Abruf-Ereignissen darunter. Doppelmeldungen werden am Ende
			// zusammengefasst.
			if (nachricht.type() === "error") konsole.push(nachricht.text());
		});
		seite.on("pageerror", (fehler) => konsole.push(String(fehler)));
		seite.on("requestfailed", (abruf) => {
			konsole.push(
				`Abruf fehlgeschlagen: ${abruf.url()} (${abruf.failure()?.errorText ?? "unbekannt"})`,
			);
		});
		seite.on("response", (antwort) => {
			if (antwort.status() >= 400) {
				konsole.push(`Status ${antwort.status()} für ${antwort.url()}`);
			}
		});

		// "load" statt "networkidle0": Netzruhe abzuwarten hängt sich in
		// Bauumgebungen an offenen Verbindungen auf, und für axe genügt ein
		// fertig geladenes Dokument.
		const antwort = await seite.goto(`${basis}${pfad}`, {
			waitUntil: "load",
			timeout: 20000,
		});
		if (!antwort || !antwort.ok()) {
			console.error(`  ✗ ${pfad}: Status ${antwort?.status() ?? "keine Antwort"}`);
			verstoesse += 1;
			continue;
		}

		// Bewusst evaluate statt addScriptTag: ein eingefügtes <script>-Element
		// würde an der eigenen Content-Security-Policy scheitern. evaluate läuft
		// über das Debug-Protokoll und ist davon nicht betroffen.
		await seite.evaluate(axeQuelle);
		const ergebnis = await seite.evaluate(async () => {
			return await globalThis.axe.run(globalThis.document, {
				runOnly: {
					type: "tag",
					values: [
						"wcag2a",
						"wcag2aa",
						"wcag21a",
						"wcag21aa",
						"best-practice",
					],
				},
			});
		});

		if (ergebnis.violations.length === 0 && konsole.length === 0) {
			console.log(`  ✓ ${pfad}`);
		}

		for (const verstoss of ergebnis.violations) {
			verstoesse += 1;
			console.error(
				`  ✗ ${pfad}: [${verstoss.impact}] ${verstoss.id} — ${verstoss.help}`,
			);
			for (const knoten of verstoss.nodes.slice(0, 3)) {
				console.error(`      ${knoten.target.join(" ")}`);
			}
		}

		// Eine Konsolenmeldung ist fast immer ein blockierter Abruf oder ein
		// Verstoß gegen die Content-Security-Policy. Beides ist ein Fehler.
		for (const zeile of new Set(konsole)) {
			verstoesse += 1;
			console.error(`  ✗ ${pfad}: Konsolenfehler — ${zeile}`);
		}

		await seite.close();
	}
} finally {
	await browser.close();
}

if (verstoesse > 0) {
	console.error(`\nBarrierefreiheitsprüfung fehlgeschlagen: ${verstoesse} Befunde.`);
	process.exit(1);
}

console.log(`Barrierefreiheit geprüft: ${pfade.length} Seiten, keine Befunde.`);
