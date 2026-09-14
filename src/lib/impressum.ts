import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { z } from "zod";

/**
 * Liest content/impressum.yaml und prüft es beim Bauen.
 *
 * Der Zweck der Prüfung ist nicht Typsicherheit, sondern Haftung: aus dieser
 * einen Datei entstehen das Impressum, NAP.md und die strukturierten Daten.
 * Ein Tippfehler in der Anschrift liefe sonst unbemerkt in alle drei.
 */

const nichtLeer = z.string().trim().min(1);

const schema = z.object({
	firmenwortlaut: nichtLeer,
	inhaber: nichtLeer,
	rechtsform: nichtLeer,
	gruendung: z.iso.date("gruendung: Datum im Format JJJJ-MM-TT"),
	anschrift: z.object({
		strasse: nichtLeer,
		plz: z.string().regex(/^\d{4}$/, "österreichische Postleitzahl, vier Ziffern"),
		ort: nichtLeer,
		land: nichtLeer,
		landCode: z.string().length(2),
	}),
	telefon: z.object({
		anzeige: nichtLeer,
		e164: z.string().regex(/^\+[1-9]\d{6,14}$/, "E.164: führendes Pluszeichen, nur Ziffern"),
	}),
	email: z.string().email().endsWith("@cesec.at"),
	website: z.url(),
	unternehmensgegenstand: nichtLeer,
	firmenbuch: z.object({
		nummer: z.string().regex(/^FN \d{2,7}[a-z]$/, "Firmenbuchnummer, etwa „FN 603544s“"),
		gericht: nichtLeer,
	}),
	umsatzsteuer: z.object({
		uid: z.string().regex(/^ATU\d{8}$/, "österreichische UID, etwa „ATU12345678“"),
	}),
	gewerbe: z.object({
		wortlaut: nichtLeer,
		gisaZahl: z.string().regex(/^\d{6,9}$/).nullable(),
		behoerde: nichtLeer,
		rechtsvorschrift: nichtLeer,
		rechtsvorschriftUrl: z.url(),
	}),
	kammer: z.object({ name: nichtLeer, fachgruppe: nichtLeer, url: z.url() }),
	medien: z.object({ medieninhaber: nichtLeer, grundlegendeRichtung: nichtLeer }),
	profile: z.object({
		linkedin: z.url(),
		googleUnternehmensprofil: z.url().nullable(),
	}),
});

export type Impressum = z.infer<typeof schema>;

function laden(): Impressum {
	const roh = parse(readFileSync("content/impressum.yaml", "utf8"));
	const ergebnis = schema.safeParse(roh);
	if (!ergebnis.success) {
		const zeilen = ergebnis.error.issues.map(
			(fehler) => `  ${fehler.path.join(".")}: ${fehler.message}`,
		);
		throw new Error(
			`content/impressum.yaml ist unvollständig oder fehlerhaft:\n${zeilen.join("\n")}`,
		);
	}
	return ergebnis.data;
}

export const impressum = laden();

/**
 * Felder, die der Inhaber noch liefern muss. Die betroffenen Angaben bleiben
 * im Impressum aus, statt mit einem Platzhalter zu erscheinen. Gemeldet wird
 * das einmal pro Build von scripts/nap.mjs — nicht hier, weil Next dieses
 * Modul in jedem Arbeitsprozess erneut lädt.
 */
export const offeneFelder = [
	impressum.gewerbe.gisaZahl === null ? "gewerbe.gisaZahl" : null,
	impressum.profile.googleUnternehmensprofil === null
		? "profile.googleUnternehmensprofil"
		: null,
].filter((feld): feld is string => feld !== null);

/** Anschrift in einer Zeile, wie sie in NAP.md und im JSON-LD steht. */
export function anschriftEinzeilig(): string {
	const { strasse, plz, ort, land } = impressum.anschrift;
	return `${strasse}, ${plz} ${ort}, ${land}`;
}
