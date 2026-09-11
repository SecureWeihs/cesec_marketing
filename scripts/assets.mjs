/**
 * Erzeugt alle ausgelieferten Bilddateien aus den Quelldateien in assets/source.
 *
 * assets/source wird nicht ausgeliefert und liegt nicht im Repository: die
 * Dateien tragen Metadaten, Handyfotos oft GPS-Koordinaten. Alles, was dieses
 * Skript nach public/ schreibt, ist metadatenfrei — sharp überträgt keine
 * EXIF- oder XMP-Daten, solange withMetadata() nicht aufgerufen wird.
 * scripts/pruefe-bilder.mjs erzwingt das im CI.
 *
 * Aufruf: node scripts/assets.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { logo } from "../src/lib/logo.ts";

/*
 * Die Vorschaubilder werden mit den Hausschriften gesetzt. librsvg findet sie
 * nur über fontconfig, und fontconfig liest seine Konfiguration beim ersten
 * Zugriff. Deshalb steht die Umgebungsvariable, bevor sharp geladen wird —
 * daher der dynamische Import statt einer Import-Anweisung oben.
 */
const SCHRIFT_KONFIG = resolve("assets/source/fontconfig");
if (existsSync(SCHRIFT_KONFIG)) {
	process.env["FONTCONFIG_PATH"] = SCHRIFT_KONFIG;
} else {
	console.warn(
		"assets: assets/source/fontconfig fehlt — die Vorschaubilder werden mit\n" +
			"        Ersatzschriften gesetzt und sehen anders aus als vorgesehen.",
	);
}
const { default: sharp } = await import("sharp");

const QUELLE = "assets/source";
const FOTO = `${QUELLE}/pb_2026.jpg`;

/** Gestaltungstoken, identisch zu src/app/globals.css. */
const FARBE = {
	papier: "#fdfdfb",
	tinte: "#16202b",
	stahl: "#545c66",
	signal: "#0d4d80",
	linie: "#d9dbd6",
};

/** Der schwarze Rahmen der Aufnahme, gemessen: 15 px auf allen Seiten. */
const FOTO_RAHMEN = { left: 15, top: 15, width: 1200, height: 1800 };

const dateien = [];
const notiere = (pfad, groesse) => dateien.push({ pfad, groesse });

async function schreibe(pfad, puffer) {
	await mkdir(pfad.split("/").slice(0, -1).join("/"), { recursive: true });
	await writeFile(pfad, puffer);
	notiere(pfad, puffer.length);
}

/** Die Marke als eigenständiges SVG, in einer Farbe, ohne Verlauf. */
function markeAlsSvg(farbe = FARBE.signal, rand = 0) {
	const b = logo.breite + rand * 2;
	const h = logo.hoehe + rand * 2;
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-rand} ${-rand} ${b} ${h}" role="img" aria-label="Cesec"><path fill="${farbe}" fill-rule="evenodd" d="${logo.pfad}"/></svg>`;
}

/** Minimaler ICO-Behälter mit einem eingebetteten PNG. */
function icoAus(png, kante) {
	const kopf = Buffer.alloc(22);
	kopf.writeUInt16LE(0, 0); // reserviert
	kopf.writeUInt16LE(1, 2); // Typ: Symbol
	kopf.writeUInt16LE(1, 4); // ein Bild
	kopf.writeUInt8(kante >= 256 ? 0 : kante, 6);
	kopf.writeUInt8(kante >= 256 ? 0 : kante, 7);
	kopf.writeUInt8(0, 8); // keine Farbtabelle
	kopf.writeUInt8(0, 9);
	kopf.writeUInt16LE(1, 10); // Ebenen
	kopf.writeUInt16LE(32, 12); // Bit je Pixel
	kopf.writeUInt32LE(png.length, 14);
	kopf.writeUInt32LE(22, 18); // Versatz der Bilddaten
	return Buffer.concat([kopf, png]);
}

async function marke() {
	const svg = Buffer.from(markeAlsSvg());
	await schreibe("public/logo.svg", svg);
	await schreibe("public/favicon.svg", Buffer.from(markeAlsSvg(FARBE.signal, 40)));

	const png32 = await sharp(svg, { density: 600 })
		.resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
		.png({ compressionLevel: 9 })
		.toBuffer();
	await schreibe("public/favicon.ico", icoAus(png32, 32));

	// Apple legt das Symbol auf eine eigene Fläche und rundet die Ecken;
	// Transparenz wird dort schwarz. Deshalb mit Grund und Rand.
	for (const kante of [180, 192, 512]) {
		const rand = Math.round(kante * 0.14);
		const inhalt = await sharp(svg, { density: 1200 })
			.resize(kante - rand * 2, kante - rand * 2, {
				fit: "contain",
				background: { r: 0, g: 0, b: 0, alpha: 0 },
			})
			.toBuffer();
		const bild = await sharp({
			create: {
				width: kante,
				height: kante,
				channels: 4,
				background: FARBE.papier,
			},
		})
			.composite([{ input: inhalt, gravity: "centre" }])
			.png({ compressionLevel: 9 })
			.toBuffer();
		await schreibe(
			kante === 180 ? "public/apple-touch-icon.png" : `public/icon-${kante}.png`,
			bild,
		);
	}

	// Maskierbares Symbol: der sichere Bereich ist der innere Kreis mit
	// 80 Prozent Durchmesser. Die Marke sitzt deshalb auf 58 Prozent Breite.
	const kern = await sharp(svg, { density: 1200 })
		.resize(297, 297, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
		.toBuffer();
	const maskierbar = await sharp({
		create: { width: 512, height: 512, channels: 4, background: FARBE.papier },
	})
		.composite([{ input: kern, gravity: "centre" }])
		.png({ compressionLevel: 9 })
		.toBuffer();
	await schreibe("public/icon-512-maskable.png", maskierbar);

	await schreibe(
		"public/site.webmanifest",
		Buffer.from(
			`${JSON.stringify(
				{
					name: "Cesec e. U.",
					short_name: "Cesec",
					description:
						"Externer Informationssicherheitsbeauftragter für NISG 2026 und ISO 27001.",
					start_url: "/",
					display: "browser",
					background_color: FARBE.papier,
					theme_color: FARBE.papier,
					lang: "de-AT",
					icons: [
						{ src: "/icon-192.png", sizes: "192x192", type: "image/png" },
						{ src: "/icon-512.png", sizes: "512x512", type: "image/png" },
						{
							src: "/icon-512-maskable.png",
							sizes: "512x512",
							type: "image/png",
							purpose: "maskable",
						},
					],
				},
				null,
				"\t",
			)}\n`,
		),
	);
}

/**
 * Drei Zuschnitte derselben Aufnahme. Der Brief sieht zwei Fotos vor,
 * geliefert wurde eines; bis ein zweites vorliegt, unterscheiden sich die
 * Verwendungen über den Bildausschnitt.
 */
const ZUSCHNITTE = [
	{
		name: "portraet-home",
		extract: { left: 0, top: 0, width: 1200, height: 1600 },
		breiten: [600, 1200],
	},
	{
		name: "portraet-about",
		extract: { left: 0, top: 0, width: 1200, height: 1800 },
		breiten: [560, 1120],
	},
	{
		name: "portraet-autor",
		extract: { left: 295, top: 80, width: 660, height: 660 },
		breiten: [160, 320],
	},
];

async function foto() {
	if (!existsSync(FOTO)) {
		console.warn(`assets: ${FOTO} fehlt, Porträts werden übersprungen.`);
		return;
	}
	// Erst den Rahmen abschneiden, dann aus dem Ergebnis zuschneiden: zwei
	// extract-Aufrufe in einer Kette bezieht sharp auf verschiedene Stufen.
	const ohneRahmen = await sharp(FOTO).extract(FOTO_RAHMEN).toBuffer();

	for (const zuschnitt of ZUSCHNITTE) {
		for (const breite of zuschnitt.breiten) {
			const grundlage = sharp(ohneRahmen)
				.extract(zuschnitt.extract)
				.resize(breite);
			const zusatz = breite === zuschnitt.breiten[0] ? "" : "@2x";
			await schreibe(
				`public/bilder/${zuschnitt.name}${zusatz}.avif`,
				await grundlage.clone().avif({ quality: 62, effort: 6 }).toBuffer(),
			);
			await schreibe(
				`public/bilder/${zuschnitt.name}${zusatz}.webp`,
				await grundlage.clone().webp({ quality: 78 }).toBuffer(),
			);
		}
	}
}

/**
 * Ein Vorschaubild je Seitentyp, 1200 × 630, als feste Datei.
 * Zur Laufzeit wird nichts erzeugt.
 */
const SEITENTYPEN = [
	{ name: "standard", zeile: "Informationssicherheit, prüfungsnah" },
	{ name: "leistung", zeile: "NISG 2026 · ISO 27001 · Security Services" },
	{ name: "leitfaden", zeile: "Leitfaden" },
	{ name: "about", zeile: "Dipl.-Ing. Sascha Weihs" },
];

async function vorschaubilder() {
	const marke = await sharp(Buffer.from(markeAlsSvg()), { density: 1200 })
		.resize(110)
		.toBuffer();

	for (const typ of SEITENTYPEN) {
		const text = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
	<rect width="1200" height="630" fill="${FARBE.papier}"/>
	<rect x="0" y="0" width="1200" height="8" fill="${FARBE.signal}"/>
	<text x="90" y="330" font-family="Source Serif 4" font-weight="600" font-size="62" fill="${FARBE.tinte}">${typ.zeile}</text>
	<line x1="90" y1="384" x2="1110" y2="384" stroke="${FARBE.linie}" stroke-width="2"/>
	<text x="90" y="440" font-family="Inter" font-size="30" fill="${FARBE.stahl}">Cesec e. U. · Externer Informationssicherheitsbeauftragter · cesec.at</text>
</svg>`;
		const bild = await sharp(Buffer.from(text))
			.composite([{ input: marke, left: 90, top: 90 }])
			.png({ compressionLevel: 9, palette: true })
			.toBuffer();
		await schreibe(`public/og/${typ.name}.png`, bild);
	}
}

await marke();
await foto();
await vorschaubilder();

const gesamt = dateien.reduce((summe, d) => summe + d.groesse, 0);
console.log(`assets: ${dateien.length} Dateien, ${(gesamt / 1024).toFixed(0)} KB`);
for (const d of dateien) {
	console.log(`  ${d.pfad.padEnd(38)} ${(d.groesse / 1024).toFixed(1).padStart(7)} KB`);
}
