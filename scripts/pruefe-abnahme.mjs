/**
 * Abnahmekriterien aus Abschnitt 18 des Briefs, geprüft an einer laufenden
 * Instanz. Die Seitenliste kommt aus der Sitemap, damit keine Seite
 * durchrutscht, die später dazukommt.
 *
 *   Kriterium  7  Sitemap und robots.txt erreichbar und korrekt
 *   Kriterium  8  Titel 50–60 Zeichen, Beschreibung 140–158, beides eindeutig
 *   Kriterium 10  keine Preis-, Kosten- oder Tagsatzangabe, kein Eurobetrag
 *                 (Ausnahme: gesetzliche Schwellen im Selbstcheck, siehe W1)
 *   Kriterium 12  gerendertes Impressum gleich den Stammdaten
 *   Kriterium 15  keine Firmennamen auf /referenzen
 *   Kriterium 16  keine der in 7.9 verbotenen Formulierungen
 *   dazu: genau eine h1, strukturierte Daten je Seitentyp, FAQ-Auszeichnung
 *   nur mit sichtbaren Fragen
 *
 * Aufruf: node scripts/pruefe-abnahme.mjs http://127.0.0.1:3000
 */
import { readFile } from "node:fs/promises";
import { parse } from "yaml";

const basis = (process.argv[2] ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const KANONISCH = "https://cesec.at";
const SELBSTCHECK = "/nis2-nisg-2026/betroffenheit-pruefen";

const fehler = [];
const melde = (pfad, text) => fehler.push(`${pfad}: ${text}`);

const entitaeten = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", "#x27": "'", nbsp: " " };
const entschluesseln = (s) => s.replace(/&(amp|lt|gt|quot|#39|#x27|nbsp);/g, (_, e) => entitaeten[e]);

function sichtbarerText(html) {
	return entschluesseln(
		html
			.replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/g, " ")
			// Kommentare und Tags werden durch ein Leerzeichen ersetzt, nicht
			// entfernt: So kann aus Resten kein neues Tag zusammenwachsen. Die
			// Kommentarmarken von React fallen dabei mit weg.
			.replace(/<[^>]+>/g, " "),
	).replace(/\s+/g, " ");
}

async function hole(pfad) {
	const r = await fetch(`${basis}${pfad}`);
	return { status: r.status, text: await r.text() };
}

// Kriterium 7
const robots = await hole("/robots.txt");
if (robots.status !== 200 || !robots.text.includes(`Sitemap: ${KANONISCH}/sitemap.xml`)) melde("/robots.txt", "fehlt oder verweist nicht auf die Sitemap");
const sitemap = await hole("/sitemap.xml");
const pfade = [...sitemap.text.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].replace(KANONISCH, "") || "/");
if (pfade.length <= 12) melde("/sitemap.xml", `nur ${pfade.length} Einträge, erwartet mehr als 12`);

const titel = new Map();
const beschreibungen = new Map();

const VERBOTEN_KI = [
	"Ihre Daten verlassen Ihr Haus nicht",
	"keine US-Cloud",
	"keine Datenübermittlung in Drittländer",
	"vollständig lokale Datenverarbeitung",
	"DSGVO-konform",
];
const PREISWORTE = /\b(Tagsatz|Tagessatz|Stundensatz|Honorar|Pauschale|kostenlos|gratis|unverbindliches Angebot ab)\b/i;
const EURO = /€|\bEUR\b|\bEuro\b/g;
const GESETZESSCHWELLE = /\b(?:über |bis )?\d+(?: bis \d+)? Millionen Euro\b/g;

for (const pfad of pfade) {
	const { status, text: html } = await hole(pfad);
	if (status !== 200) {
		melde(pfad, `Status ${status}`);
		continue;
	}
	const text = sichtbarerText(html);

	// Kriterium 8
	const t = entschluesseln(/<title>(.*?)<\/title>/.exec(html)?.[1] ?? "");
	const d = entschluesseln(/<meta name="description" content="(.*?)"/.exec(html)?.[1] ?? "");
	if (t.length < 50 || t.length > 60) melde(pfad, `Titel hat ${t.length} Zeichen, erlaubt 50–60: „${t}“`);
	if (d.length < 140 || d.length > 158) melde(pfad, `Beschreibung hat ${d.length} Zeichen, erlaubt 140–158`);
	if (titel.has(t)) melde(pfad, `Titel doppelt mit ${titel.get(t)}`);
	if (beschreibungen.has(d)) melde(pfad, `Beschreibung doppelt mit ${beschreibungen.get(d)}`);
	titel.set(t, pfad);
	beschreibungen.set(d, pfad);

	const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
	if (h1 !== 1) melde(pfad, `${h1} h1-Überschriften, erwartet genau eine`);

	// Kriterium 10
	if (PREISWORTE.test(text)) melde(pfad, `Preisangabe: „${PREISWORTE.exec(text)?.[0]}“`);
	const euro = (text.match(EURO) ?? []).length;
	const erlaubt = pfad === SELBSTCHECK ? (text.match(GESETZESSCHWELLE) ?? []).length : 0;
	if (euro > erlaubt) melde(pfad, `${euro - erlaubt} Eurobetrag/-beträge außerhalb der gesetzlichen Schwellen`);

	// Kriterium 16
	for (const satz of VERBOTEN_KI) if (text.includes(satz)) melde(pfad, `verbotene Formulierung: „${satz}“`);

	// Strukturierte Daten
	const daten = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
	const typen = daten.map((x) => x["@type"]);
	if (!typen.includes("ProfessionalService")) melde(pfad, "ProfessionalService fehlt");
	for (const x of daten) {
		if (x["@type"] === "ProfessionalService" && ("priceRange" in x || "offers" in x)) melde(pfad, "ProfessionalService mit Preisangabe");
		if (x["@type"] === "AggregateRating" || "aggregateRating" in x) melde(pfad, "AggregateRating ohne echte Bewertungen");
		if (x["@type"] === "FAQPage") {
			for (const frage of x.mainEntity) if (!text.includes(frage.name)) melde(pfad, `FAQ-Frage nicht sichtbar: „${frage.name}“`);
		}
		if (x["@type"] === "Article") {
			for (const feld of ["headline", "datePublished", "dateModified", "author", "publisher", "image"]) if (!(feld in x)) melde(pfad, `Article ohne ${feld}`);
		}
	}
	if (pfad !== "/" && !typen.includes("BreadcrumbList")) melde(pfad, "BreadcrumbList fehlt");

	// Kriterium 15
	if (pfad === "/referenzen") {
		const ohneEigenes = text.replaceAll("Cesec e. U.", "");
		const firma = /\b[A-ZÄÖÜ][\wäöüß-]+ (GmbH|AG|KG|OG|e\. ?U\.|SE)\b/.exec(ohneEigenes);
		if (firma) melde(pfad, `möglicher Firmenname: „${firma[0]}“`);
	}
}

// Kriterium 12
const stamm = parse(await readFile("content/impressum.yaml", "utf8"));
const impressum = sichtbarerText((await hole("/impressum")).text);
for (const [feld, wert] of [
	["Firmenwortlaut", stamm.firmenwortlaut],
	["Straße", stamm.anschrift.strasse],
	["Postleitzahl und Ort", `${stamm.anschrift.plz} ${stamm.anschrift.ort}`],
	["Telefon", stamm.telefon.anzeige],
	["E-Mail", stamm.email],
	["Firmenbuchnummer", stamm.firmenbuch.nummer],
	["UID", stamm.umsatzsteuer.uid],
]) {
	if (!impressum.includes(wert)) melde("/impressum", `${feld} weicht von content/impressum.yaml ab („${wert}“ nicht gefunden)`);
}

if (fehler.length > 0) {
	console.error(`Abnahmeprüfung gegen ${basis} fehlgeschlagen:\n`);
	for (const f of fehler) console.error(`  ✗ ${f}`);
	process.exit(1);
}
console.log(`Abnahmeprüfung gegen ${basis} bestanden: ${pfade.length} Seiten aus der Sitemap, Kriterien 7, 8, 10, 12, 15, 16 sowie h1, strukturierte Daten und FAQ.`);
