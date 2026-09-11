/**
 * Formt die Kennzahlen eines Monats zu einem Markdown-Bericht.
 * Reine Funktion, damit sie ohne Zugangsdaten getestet werden kann.
 */
import type { Suchzeile } from "./search-console.ts";

export type Monatsdaten = {
	monat: string; // JJJJ-MM
	beispiel: boolean;
	umami: {
		besuche: number;
		besucher: number;
		seitenaufrufe: number;
		seiten: { pfad: string; aufrufe: number }[];
		quellen: { quelle: string; besuche: number }[];
		ereignisse: { name: string; anzahl: number }[];
	} | null;
	suche: Suchzeile[] | null;
	fehler: string[];
};

const zahl = (n: number) => n.toLocaleString("de-AT");
const prozent = (n: number) => `${(n * 100).toLocaleString("de-AT", { maximumFractionDigits: 1 })} %`;

function tabelle(kopf: string[], zeilen: (string | number)[][]): string {
	if (zeilen.length === 0) return "_Keine Daten._\n";
	return [
		`| ${kopf.join(" | ")} |`,
		`|${kopf.map((_, i) => (i === 0 ? "---" : "---:")).join("|")}|`,
		...zeilen.map((z) => `| ${z.join(" | ")} |`),
	].join("\n") + "\n";
}

const EREIGNIS_TEXT: Record<string, string> = {
	telefon: "Klick auf die Telefonnummer",
	email: "Klick auf die E-Mail-Adresse",
	"selbstcheck-abgeschlossen": "Selbstcheck abgeschlossen",
};

export function berichtAlsMarkdown(d: Monatsdaten): string {
	const teile: string[] = [];
	teile.push(`# Bericht ${d.monat}`);
	teile.push("");
	if (d.beispiel) {
		teile.push("> **Beispielbericht mit erfundenen Zahlen.** Er zeigt Aufbau und Inhalt; es gibt noch keine echte Messung. Erzeugt mit `node scripts/analytics-report.ts --beispiel`.");
		teile.push("");
	}
	teile.push("Erzeugt von `scripts/analytics-report.ts`. Quellen: Umami (eigene Instanz) und Google Search Console.");
	teile.push("");

	if (d.umami) {
		const u = d.umami;
		teile.push("## Besuche");
		teile.push("");
		teile.push(tabelle(["Kennzahl", "Wert"], [
			["Besuche", zahl(u.besuche)],
			["Besucher (wechselnde Einweg-Kennung, keine Personen)", zahl(u.besucher)],
			["Seitenaufrufe", zahl(u.seitenaufrufe)],
		]));
		teile.push("## Erstkontakte");
		teile.push("");
		teile.push("Ziel laut Brief: ein organischer Erstkontakt pro Monat, zwölf Monate nach dem Start. Gezählt werden anonyme Ereignisse, keine Inhalte.");
		teile.push("");
		teile.push(tabelle(["Ereignis", "Anzahl"], u.ereignisse.map((e) => [EREIGNIS_TEXT[e.name] ?? e.name, zahl(e.anzahl)])));
		teile.push("## Meistgelesene Seiten");
		teile.push("");
		teile.push(tabelle(["Seite", "Aufrufe"], u.seiten.map((s) => [`\`${s.pfad}\``, zahl(s.aufrufe)])));
		teile.push("## Herkunft");
		teile.push("");
		teile.push(tabelle(["Quelle", "Besuche"], u.quellen.map((q) => [q.quelle || "direkt", zahl(q.besuche)])));
	}

	if (d.suche) {
		teile.push("## Suchanfragen (Google)");
		teile.push("");
		teile.push(tabelle(
			["Suchbegriff", "Klicks", "Impressionen", "CTR", "Ø Position"],
			d.suche.map((s) => [s.begriff, zahl(s.klicks), zahl(s.impressionen), prozent(s.ctr), s.position.toLocaleString("de-AT", { maximumFractionDigits: 1 })]),
		));
	}

	if (d.fehler.length > 0) {
		teile.push("## Nicht verfügbar");
		teile.push("");
		for (const f of d.fehler) teile.push(`- ${f}`);
		teile.push("");
	}
	return teile.join("\n");
}
