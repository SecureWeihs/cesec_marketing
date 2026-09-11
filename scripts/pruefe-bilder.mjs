/**
 * Erzwingt, dass keine ausgelieferte Bilddatei Metadaten trägt.
 *
 * Der Anlass ist konkret: Kameras und Telefone schreiben Aufnahmeort,
 * Seriennummer und Zeitstempel in die Datei. Ein Porträt vor dem eigenen Haus
 * verrät sonst dessen Koordinaten. Die Erzeugung in scripts/assets.mjs lässt
 * Metadaten weg; diese Prüfung stellt sicher, dass niemand sie wieder
 * hereinträgt — auch nicht durch eine von Hand kopierte Datei.
 *
 * Aufruf: node scripts/pruefe-bilder.mjs
 */
import { readdir, readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

const WURZEL = "public";
const BILDFORMATE = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".tif"]);

/** Kennungen, die auf eingebettete Metadatenblöcke hinweisen. */
const KENNUNGEN = [
	{ name: "EXIF", muster: Buffer.from("Exif\0\0", "latin1") },
	{ name: "XMP", muster: Buffer.from("http://ns.adobe.com/xap/", "latin1") },
	{ name: "XMP", muster: Buffer.from("<x:xmpmeta", "latin1") },
	{ name: "IPTC", muster: Buffer.from("Photoshop 3.0", "latin1") },
	{ name: "GPS", muster: Buffer.from("GPSLatitude", "latin1") },
];

async function dateien(verzeichnis) {
	const gefunden = [];
	for (const eintrag of await readdir(verzeichnis, { withFileTypes: true })) {
		const pfad = join(verzeichnis, eintrag.name);
		if (eintrag.isDirectory()) gefunden.push(...(await dateien(pfad)));
		else if (BILDFORMATE.has(extname(eintrag.name).toLowerCase()))
			gefunden.push(pfad);
	}
	return gefunden;
}

const fehler = [];
const gefundene = await dateien(WURZEL);

for (const pfad of gefundene) {
	const inhalt = await readFile(pfad);

	for (const kennung of KENNUNGEN) {
		if (inhalt.includes(kennung.muster))
			fehler.push(`${pfad}: enthält einen ${kennung.name}-Block`);
	}

	try {
		const beschreibung = await sharp(inhalt).metadata();
		for (const feld of ["exif", "xmp", "iptc"]) {
			if (beschreibung[feld])
				fehler.push(`${pfad}: sharp meldet ${feld.toUpperCase()}-Daten`);
		}
	} catch (ursache) {
		fehler.push(`${pfad}: nicht lesbar (${ursache.message})`);
	}
}

if (fehler.length > 0) {
	console.error("Bilder mit Metadaten gefunden:\n");
	for (const zeile of new Set(fehler)) console.error(`  ✗ ${zeile}`);
	console.error("\nNeu erzeugen mit: node scripts/assets.mjs");
	process.exit(1);
}

console.log(`Bilder geprüft: ${gefundene.length} Dateien, keine Metadaten.`);
