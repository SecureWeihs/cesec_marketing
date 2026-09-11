import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { z } from "zod";
import { unterseiten } from "@/lib/navigation";

/**
 * Leitfäden aus content/leitfaeden/*.mdx.
 *
 * Jede Datei beginnt mit einem YAML-Kopf (Frontmatter) zwischen zwei Zeilen
 * „---“. Der Kopf wird beim Bauen geprüft; fehlt ein Pflichtfeld oder
 * verletzt der Text eine Redaktionsregel, bricht der Build mit einer
 * Meldung ab, die sagt, was zu tun ist. So kann der Inhaber Leitfäden
 * ändern, ohne Code zu lesen — und ohne dass ein Fehler unbemerkt live geht.
 *
 * Achtung: MDX ist ausführbarer Inhalt. Nur Personen mit Schreibrecht auf das
 * Repository dürfen Leitfäden ändern.
 */

const VERZEICHNIS = "content/leitfaeden";

export const saeulen = {
	"nis2-nisg-2026": { titel: "NIS2 & NISG 2026", pfad: "/nis2-nisg-2026" },
	"iso-27001": { titel: "ISO 27001", pfad: "/iso-27001" },
} as const;

export type Saeule = keyof typeof saeulen;

const kopfSchema = z.object({
	/** Für den Browsertab und Google, ergänzt um „ | Cesec“: zusammen 50 bis 60 Zeichen. */
	title: z.string().min(42, "title: mindestens 42 Zeichen (mit „ | Cesec“ mindestens 50)").max(52, "title: höchstens 52 Zeichen (mit „ | Cesec“ höchstens 60)"),
	/** Beschreibung in den Suchergebnissen. */
	description: z.string().min(140, "description: mindestens 140 Zeichen").max(158, "description: höchstens 158 Zeichen"),
	/** Die sichtbare Hauptüberschrift. */
	ueberschrift: z.string().min(20),
	slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug: nur Kleinbuchstaben, Ziffern und Bindestriche, keine Umlaute"),
	saeule: z.enum(["nis2-nisg-2026", "iso-27001"]),
	datePublished: z.iso.date("datePublished: Datum im Format JJJJ-MM-TT"),
	dateModified: z.iso.date("dateModified: Datum im Format JJJJ-MM-TT"),
	keywords: z.array(z.string().min(3)).min(1, "keywords: mindestens ein Suchbegriff"),
	fragen: z
		.array(z.object({ frage: z.string().min(10), antwort: z.string().min(40) }))
		.min(3, "fragen: mindestens drei")
		.max(5, "fragen: höchstens fünf"),
	quellen: z.array(z.object({ titel: z.string().min(3), url: z.url() })).default([]),
});

export type Leitfaden = z.infer<typeof kopfSchema> & {
	pfad: string;
	inhalt: string;
	woerter: number;
	datei: string;
};

/** Redaktionsregeln aus Abschnitt 4, 5 und 9.5 des Briefs, geprüft am Fließtext. */
const REGELN: { muster: RegExp; meldung: string }[] = [
	{ muster: /\b(seit kurzem|derzeit|in diesem Jahr|heuer)\b/i, meldung: "Leitfäden sind zeitlos formuliert: „seit kurzem“, „derzeit“, „in diesem Jahr“ und „heuer“ vermeiden." },
	{ muster: /\b(wir|uns|unser(e|en|er|es|em)?)\b/i, meldung: "Autor-Ich statt „wir“: Cesec ist ein Ein-Personen-Unternehmen." },
	{ muster: /€|\bEuro\b|\bEUR\b/, meldung: "Keine Eurobeträge." },
	{ muster: /\b(Tagsatz|Stundensatz|Honorar|Pauschale|kostenlos|gratis)\b/i, meldung: "Keine Preis- oder Kostenangaben; Preisfragen gehören ins Erstgespräch." },
	{ muster: /\b(hier klicken|mehr erfahren)\b/i, meldung: "Verweise brauchen einen beschreibenden Ankertext, nicht „hier klicken“ oder „mehr erfahren“." },
];

function trenne(roh: string, datei: string): { kopf: unknown; inhalt: string } {
	const treffer = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(roh);
	if (!treffer?.[1] || treffer[2] === undefined) {
		throw new Error(`${datei}: Kopf fehlt. Die Datei muss mit einer Zeile „---“ beginnen, danach die Angaben, dann wieder „---“.`);
	}
	return { kopf: parse(treffer[1]), inhalt: treffer[2] };
}

function laden(): Leitfaden[] {
	const dateien = readdirSync(VERZEICHNIS).filter((name) => name.endsWith(".mdx")).sort();
	const fehler: string[] = [];
	const leitfaeden: Leitfaden[] = [];

	for (const name of dateien) {
		const datei = join(VERZEICHNIS, name);
		const { kopf, inhalt } = trenne(readFileSync(datei, "utf8"), datei);
		const ergebnis = kopfSchema.safeParse(kopf);
		if (!ergebnis.success) {
			for (const f of ergebnis.error.issues) fehler.push(`${datei}: ${f.path.join(".") || "Kopf"} — ${f.message}`);
			continue;
		}
		const k = ergebnis.data;
		if (`${k.slug}.mdx` !== name) fehler.push(`${datei}: Dateiname und slug müssen übereinstimmen („${k.slug}.mdx“).`);
		if (k.dateModified < k.datePublished) fehler.push(`${datei}: dateModified liegt vor datePublished.`);

		for (const regel of REGELN) {
			const t = regel.muster.exec(inhalt);
			if (t) fehler.push(`${datei}: „${t[0]}“ — ${regel.meldung}`);
		}

		const pfad = `${saeulen[k.saeule].pfad}/${k.slug}`;
		const verweise = [...inhalt.matchAll(/\]\((\/[a-z0-9/-]*)\)/g)].map((m) => m[1]);
		if (!verweise.includes(saeulen[k.saeule].pfad)) {
			fehler.push(`${datei}: Jeder Leitfaden verweist auf seine Elternseite (${saeulen[k.saeule].pfad}).`);
		}

		const woerter = inhalt.replace(/<[^>]+>|\[|\]\([^)]*\)|[#*_>|-]/g, " ").split(/\s+/).filter((w) => /\w/.test(w)).length;
		leitfaeden.push({ ...k, pfad, inhalt, woerter, datei });
	}

	// Verweis auf mindestens einen weiteren Leitfaden (Abschnitt 6 des Briefs).
	const allePfade = new Set(leitfaeden.map((l) => l.pfad));
	for (const l of leitfaeden) {
		const andere = [...l.inhalt.matchAll(/\]\((\/[a-z0-9/-]*)\)/g)].map((m) => m[1]).filter((p) => p !== l.pfad && p && allePfade.has(p));
		if (andere.length === 0) fehler.push(`${l.datei}: Jeder Leitfaden verweist auf mindestens einen weiteren Leitfaden.`);
	}

	// Navigation und Inhalt müssen zusammenpassen.
	for (const seite of unterseiten) {
		if (seite.pfad.endsWith("betroffenheit-pruefen")) continue;
		const vorhanden = allePfade.has(seite.pfad);
		if (seite.verfuegbar && !vorhanden) fehler.push(`src/lib/navigation.ts: ${seite.pfad} ist als verfügbar markiert, es gibt aber keine Datei dazu.`);
		if (!seite.verfuegbar && vorhanden) fehler.push(`src/lib/navigation.ts: ${seite.pfad} existiert als Leitfaden, ist aber nicht als verfügbar markiert.`);
	}

	const titel = new Set<string>();
	for (const l of leitfaeden) {
		if (titel.has(l.title)) fehler.push(`${l.datei}: title „${l.title}“ ist doppelt vergeben.`);
		titel.add(l.title);
	}

	if (fehler.length > 0) {
		throw new Error(`Leitfäden fehlerhaft:\n${fehler.map((f) => `  ✗ ${f}`).join("\n")}`);
	}
	return leitfaeden;
}

export const leitfaeden = laden();

export function leitfadenFuer(saeule: Saeule, slug: string): Leitfaden | undefined {
	return leitfaeden.find((l) => l.saeule === saeule && l.slug === slug);
}

/** Leitfäden, deren letzte Änderung mehr als zwölf Monate zurückliegt (Abschnitt 9.5). */
export function ueberfaellig(stichtag = new Date()): Leitfaden[] {
	const grenze = new Date(stichtag);
	grenze.setFullYear(grenze.getFullYear() - 1);
	return leitfaeden.filter((l) => new Date(l.dateModified) < grenze);
}
