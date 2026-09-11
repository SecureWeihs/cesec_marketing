/**
 * Monatsbericht zur Website-Nutzung, geschrieben nach reports/JJJJ-MM.md.
 *
 * Quellen: Umami (Seitenaufrufe, Quellen, Konversionsereignisse) und die
 * Google Search Console (Suchanfragen und Positionen). Zugangsdaten
 * ausschließlich aus Umgebungsvariablen:
 *
 *   UMAMI_HOST, UMAMI_BENUTZER, UMAMI_PASSWORT, NEXT_PUBLIC_UMAMI_WEBSITE_ID
 *   GSC_SERVICE_ACCOUNT, GSC_SITE_URL
 *
 * Aufruf:
 *   node scripts/analytics-report.ts             Vormonat
 *   node scripts/analytics-report.ts 2027-03     bestimmter Monat
 *   node scripts/analytics-report.ts --beispiel  Beispielbericht ohne Zugang
 *
 * Fehlt eine Quelle, entsteht der Bericht trotzdem, mit einem Hinweis, was
 * nicht verfügbar war.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { berichtAlsMarkdown, type Monatsdaten } from "./analyse/bericht.ts";
import { suchanfragen } from "./analyse/search-console.ts";
import { umamiMonat } from "./analyse/umami.ts";

function monatsgrenzen(monat: string): { start: string; ende: string } {
	const [jahr, m] = monat.split("-").map(Number) as [number, number];
	const erster = new Date(Date.UTC(jahr, m - 1, 1));
	const letzter = new Date(Date.UTC(jahr, m, 0));
	return { start: erster.toISOString().slice(0, 10), ende: letzter.toISOString().slice(0, 10) };
}

function vormonat(): string {
	const d = new Date();
	d.setUTCDate(1);
	d.setUTCMonth(d.getUTCMonth() - 1);
	return d.toISOString().slice(0, 7);
}

const BEISPIEL: Monatsdaten = {
	monat: "2027-03",
	beispiel: true,
	umami: {
		besuche: 412,
		besucher: 318,
		seitenaufrufe: 1034,
		seiten: [
			{ pfad: "/nis2-nisg-2026", aufrufe: 288 },
			{ pfad: "/nis2-nisg-2026/betroffenheit-pruefen", aufrufe: 201 },
			{ pfad: "/", aufrufe: 164 },
			{ pfad: "/nis2-nisg-2026/fristen-und-registrierung", aufrufe: 97 },
			{ pfad: "/iso-27001", aufrufe: 83 },
		],
		quellen: [
			{ quelle: "google.com", besuche: 251 },
			{ quelle: "", besuche: 96 },
			{ quelle: "linkedin.com", besuche: 44 },
			{ quelle: "bing.com", besuche: 21 },
		],
		ereignisse: [
			{ name: "selbstcheck-abgeschlossen", anzahl: 57 },
			{ name: "telefon", anzahl: 4 },
			{ name: "email", anzahl: 2 },
		],
	},
	suche: [
		{ begriff: "nis2 betroffen österreich", klicks: 38, impressionen: 910, ctr: 0.0418, position: 7.2 },
		{ begriff: "nisg 2026 registrierung", klicks: 27, impressionen: 540, ctr: 0.05, position: 5.9 },
		{ begriff: "externer informationssicherheitsbeauftragter", klicks: 9, impressionen: 310, ctr: 0.029, position: 11.4 },
	],
	fehler: [],
};

async function echteDaten(monat: string): Promise<Monatsdaten> {
	const { start, ende } = monatsgrenzen(monat);
	const daten: Monatsdaten = { monat, beispiel: false, umami: null, suche: null, fehler: [] };
	try {
		daten.umami = await umamiMonat(start, ende);
	} catch (ursache) {
		daten.fehler.push(`Umami: ${(ursache as Error).message}`);
	}
	try {
		daten.suche = await suchanfragen(start, ende);
	} catch (ursache) {
		daten.fehler.push(`Search Console: ${(ursache as Error).message}`);
	}
	return daten;
}

const argumente = process.argv.slice(2);
const beispiel = argumente.includes("--beispiel");
const monat = argumente.find((a) => /^\d{4}-\d{2}$/.test(a)) ?? vormonat();
const daten = beispiel ? BEISPIEL : await echteDaten(monat);
const ziel = `reports/${beispiel ? "beispiel" : daten.monat}.md`;

await mkdir("reports", { recursive: true });
await writeFile(ziel, berichtAlsMarkdown(daten), "utf8");
console.log(`Bericht geschrieben: ${ziel}${daten.fehler.length ? ` (${daten.fehler.length} Quelle(n) nicht verfügbar)` : ""}`);
