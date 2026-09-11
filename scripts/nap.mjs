/**
 * Schreibt NAP.md aus content/impressum.yaml — oder prüft, ob beide
 * übereinstimmen.
 *
 * NAP steht für Name, Address, Phone. Suchmaschinen führen Einträge nur dann
 * zusammen, wenn diese drei Angaben überall zeichengenau gleich geschrieben
 * sind: auf der Website, im Google-Unternehmensprofil, im WKO-Firmen-A-Z, auf
 * herold.at, firmenabc.at und im LinkedIn-Profil. NAP.md ist die verbindliche
 * Schreibweise zum Abtippen.
 *
 *   node scripts/nap.mjs           schreibt NAP.md
 *   node scripts/nap.mjs --verify  scheitert, wenn NAP.md abweicht
 */
import { readFile, writeFile } from "node:fs/promises";
import { parse } from "yaml";

const ZIEL = "NAP.md";
const daten = parse(await readFile("content/impressum.yaml", "utf8"));

/* Fehlende Angaben einmal je Build melden, statt sie stillschweigend wegzulassen. */
const offen = [
	daten.gewerbe?.gisaZahl == null ? "gewerbe.gisaZahl" : null,
	daten.profile?.googleUnternehmensprofil == null
		? "profile.googleUnternehmensprofil"
		: null,
].filter(Boolean);

if (offen.length > 0) {
	console.warn(
		`impressum.yaml: ${offen.join(", ")} fehlt noch — die betroffenen Angaben bleiben auf der Website aus.`,
	);
}

const zeilen = [
	"# NAP — verbindliche Schreibweise",
	"",
	"Erzeugt aus `content/impressum.yaml`. Nicht von Hand ändern: `npm run nap`.",
	"",
	"Diese Schreibweise muss zeichengenau identisch sein auf der Website, im",
	"Google-Unternehmensprofil, im WKO-Firmen-A-Z, auf herold.at, firmenabc.at",
	"und im LinkedIn-Unternehmensprofil. Schon ein abweichender Abstand oder ein",
	"ausgeschriebenes „Straße“ kann verhindern, dass Suchmaschinen die Einträge",
	"demselben Unternehmen zuordnen.",
	"",
	"## Zum Abtippen",
	"",
	"```",
	daten.firmenwortlaut,
	daten.anschrift.strasse,
	`${daten.anschrift.plz} ${daten.anschrift.ort}`,
	daten.anschrift.land,
	daten.telefon.anzeige,
	daten.email,
	daten.website,
	"```",
	"",
	"## Einzelfelder",
	"",
	"| Feld | Wert |",
	"|---|---|",
	`| Firmenwortlaut | ${daten.firmenwortlaut} |`,
	`| Inhaber | ${daten.inhaber} |`,
	`| Straße | ${daten.anschrift.strasse} |`,
	`| Postleitzahl | ${daten.anschrift.plz} |`,
	`| Ort | ${daten.anschrift.ort} |`,
	`| Land | ${daten.anschrift.land} |`,
	`| Telefon, Anzeige | ${daten.telefon.anzeige} |`,
	`| Telefon, E.164 | ${daten.telefon.e164} |`,
	`| E-Mail | ${daten.email} |`,
	`| Website | ${daten.website} |`,
	"",
	"## Hinweise",
	"",
	"- Die Telefonnummer steht in jedem `tel:`-Verweis und in den strukturierten",
	"  Daten im Format E.164, sichtbar aber immer in der Anzeigeform.",
	"- Cesec ist Dienstleister ohne Kundenverkehr am Standort. Im",
	"  Google-Unternehmensprofil wird deshalb ein Einzugsgebiet gepflegt und die",
	"  Anschrift ausgeblendet. Ausgeblendet heißt nicht abweichend: hinterlegt",
	"  bleibt genau diese Schreibweise.",
	"- Es gibt genau eine E-Mail-Adresse. Keine Aliasse, kein `office@`.",
	"",
];

const inhalt = `${zeilen.join("\n")}`;

if (process.argv.includes("--verify")) {
	const bestand = await readFile(ZIEL, "utf8").catch(() => "");
	if (bestand !== inhalt) {
		console.error(
			`${ZIEL} weicht von content/impressum.yaml ab. Neu erzeugen: npm run nap`,
		);
		process.exit(1);
	}
	console.log(`${ZIEL} stimmt mit den Stammdaten überein.`);
} else {
	await writeFile(ZIEL, inhalt, "utf8");
	console.log(`${ZIEL} geschrieben.`);
}
