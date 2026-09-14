/**
 * Prüft die Transportsicherung der E-Mail an der echten Domain:
 *
 *   1. MX-Einträge stimmen mit der Richtlinie überein
 *   2. TXT `_mta-sts` vorhanden, Version und Kennung korrekt
 *   3. Richtliniendatei über HTTPS erreichbar, text/plain, OHNE Weiterleitung
 *   4. Inhalt der Richtlinie deckt sich mit den echten MX-Einträgen
 *   5. TXT `_smtp._tls` vorhanden (TLS-RPT)
 *   6. SPF und DMARC vorhanden
 *
 * DNS wird über DNS-over-HTTPS abgefragt, damit das Skript ohne `dig` und
 * ohne lokalen Resolver läuft (auch im CI-Container).
 *
 * Aufruf: npm run pruefe:mail
 * Exit-Code 1, sobald ein Punkt fehlschlägt.
 */
import {
	BERICHTSADRESSE,
	DOMAIN,
	KENNUNG,
	MAX_AGE,
	MODUS,
	MTA_STS_HOST,
	MTA_STS_PFAD,
	MX_HOSTS,
} from "../src/lib/mta-sts.ts";

let fehler = 0;
const melde = (punkt, text) => {
	console.error(`FEHLER  ${punkt}: ${text}`);
	fehler += 1;
};
const gut = (punkt, text) => console.log(`ok      ${punkt}: ${text}`);

/** Eine DNS-Abfrage über DNS-over-HTTPS. Gibt die Antwortdaten als Liste. */
async function dns(name, typ) {
	const antwort = await fetch(
		`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${typ}`,
		{ headers: { accept: "application/dns-json" }, signal: AbortSignal.timeout(10000) },
	);
	if (!antwort.ok) throw new Error(`DNS-Abfrage ${name} ${typ} lieferte ${antwort.status}`);
	const daten = await antwort.json();
	return (daten.Answer ?? []).map((a) => String(a.data));
}

/** TXT-Antworten kommen in Anführungszeichen und ggf. in Stücken. */
const txtText = (eintrag) => eintrag.replace(/^"|"$/g, "").replaceAll('" "', "");

// 1. MX
let mxLive = [];
try {
	mxLive = (await dns(DOMAIN, "MX"))
		.map((z) => z.split(/\s+/)[1]?.replace(/\.$/, "").toLowerCase())
		.filter(Boolean)
		.sort();
	const erwartet = [...MX_HOSTS].sort();
	if (mxLive.length === 0) melde("MX", "keine MX-Einträge gefunden");
	else if (JSON.stringify(mxLive) !== JSON.stringify(erwartet))
		melde("MX", `DNS nennt ${mxLive.join(", ")}, die Richtlinie nennt ${erwartet.join(", ")}`);
	else gut("MX", mxLive.join(", "));
} catch (e) {
	melde("MX", e.message);
}

// 2. TXT _mta-sts
try {
	const eintraege = (await dns(`_mta-sts.${DOMAIN}`, "TXT")).map(txtText);
	const sts = eintraege.find((e) => e.startsWith("v=STSv1"));
	if (!sts) melde("_mta-sts", "kein TXT-Eintrag mit v=STSv1");
	else if (!sts.includes(`id=${KENNUNG}`))
		melde("_mta-sts", `Kennung weicht ab: DNS "${sts}", erwartet id=${KENNUNG}`);
	else gut("_mta-sts", sts);
} catch (e) {
	melde("_mta-sts", e.message);
}

// 3. + 4. Richtliniendatei
const url = `https://${MTA_STS_HOST}${MTA_STS_PFAD}`;
try {
	// redirect: "manual" — RFC 8461 Abschnitt 3.3 verbietet, Weiterleitungen zu
	// folgen. Eine 3xx-Antwort ist damit ein Fehler, kein Zwischenschritt.
	const antwort = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15000) });
	if (antwort.status !== 200) {
		melde("Richtliniendatei", `${url} antwortet ${antwort.status} (erwartet 200, keine Weiterleitung)`);
	} else {
		const typ = antwort.headers.get("content-type") ?? "";
		if (!typ.toLowerCase().startsWith("text/plain"))
			melde("Richtliniendatei", `Content-Type ist "${typ}", erwartet text/plain`);
		else gut("Richtliniendatei", `${url} — ${typ}`);

		const text = await antwort.text();
		const zeilen = text.split(/\r?\n/).filter(Boolean);
		const feld = (name) => zeilen.filter((z) => z.startsWith(`${name}:`)).map((z) => z.slice(name.length + 1).trim());

		if (feld("version")[0] !== "STSv1") melde("Richtlinie", "version fehlt oder ist nicht STSv1");
		if (feld("mode")[0] !== MODUS) melde("Richtlinie", `mode ist "${feld("mode")[0]}", erwartet "${MODUS}"`);
		if (Number(feld("max_age")[0]) !== MAX_AGE)
			melde("Richtlinie", `max_age ist "${feld("max_age")[0]}", erwartet ${MAX_AGE}`);

		const mxRichtlinie = feld("mx").map((m) => m.toLowerCase()).sort();
		if (mxLive.length > 0 && JSON.stringify(mxRichtlinie) !== JSON.stringify(mxLive))
			melde("Richtlinie", `MX in der Richtlinie (${mxRichtlinie.join(", ")}) weichen vom DNS (${mxLive.join(", ")}) ab`);
		else if (mxRichtlinie.length > 0) gut("Richtlinie", `mode ${MODUS}, mx ${mxRichtlinie.join(", ")}`);
	}
} catch (e) {
	melde("Richtliniendatei", `${url} nicht erreichbar: ${e.message}`);
}

// Der Website-Inhalt darf unter diesem Host nicht erscheinen, sonst wäre die
// Website unter zwei Namen indexierbar.
try {
	const antwort = await fetch(`https://${MTA_STS_HOST}/`, { redirect: "manual", signal: AbortSignal.timeout(15000) });
	if (antwort.status === 200) melde("Host", `https://${MTA_STS_HOST}/ liefert Inhalt statt einer Weiterleitung`);
	else gut("Host", `https://${MTA_STS_HOST}/ antwortet ${antwort.status}`);
} catch (e) {
	melde("Host", e.message);
}

// 5. TLS-RPT
try {
	const eintraege = (await dns(`_smtp._tls.${DOMAIN}`, "TXT")).map(txtText);
	const rpt = eintraege.find((e) => e.startsWith("v=TLSRPTv1"));
	if (!rpt) melde("_smtp._tls", "kein TXT-Eintrag mit v=TLSRPTv1");
	else if (!rpt.includes(BERICHTSADRESSE))
		melde("_smtp._tls", `Berichtsadresse weicht ab: "${rpt}", erwartet ${BERICHTSADRESSE}`);
	else gut("_smtp._tls", rpt);
} catch (e) {
	melde("_smtp._tls", e.message);
}

// 6. SPF und DMARC
try {
	const spf = (await dns(DOMAIN, "TXT")).map(txtText).find((e) => e.startsWith("v=spf1"));
	if (!spf) melde("SPF", "kein v=spf1-Eintrag");
	else gut("SPF", spf);
} catch (e) {
	melde("SPF", e.message);
}
try {
	const dmarc = (await dns(`_dmarc.${DOMAIN}`, "TXT")).map(txtText).find((e) => e.startsWith("v=DMARC1"));
	if (!dmarc) melde("DMARC", "kein v=DMARC1-Eintrag");
	else gut("DMARC", dmarc);
} catch (e) {
	melde("DMARC", e.message);
}

console.log(fehler === 0 ? "\nAlle Punkte erfüllt." : `\n${fehler} Punkt(e) offen.`);
process.exit(fehler === 0 ? 0 : 1);
