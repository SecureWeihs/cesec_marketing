/**
 * Suchanfragen aus der Google Search Console.
 *
 * Anmeldung über einen Service-Account: Ein selbst signiertes JWT (RS256,
 * signiert mit node:crypto) wird gegen ein Zugriffstoken getauscht. Keine
 * zusätzliche Bibliothek. Der Service-Account braucht in der Search Console
 * Lesezugriff auf die Property.
 *
 * Endpunkt und Felder nach der API-Referenz:
 * POST https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query
 * Scope: https://www.googleapis.com/auth/webmasters.readonly
 *
 * Zugangsdaten ausschließlich aus Umgebungsvariablen, nie aus dem Repository:
 *   GSC_SERVICE_ACCOUNT  JSON des Service-Accounts (client_email, private_key)
 *   GSC_SITE_URL         Property, etwa "sc-domain:cesec.at"
 */
import { createSign } from "node:crypto";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

export type Suchzeile = {
	begriff: string;
	klicks: number;
	impressionen: number;
	ctr: number;
	position: number;
};

type Dienstkonto = { client_email: string; private_key: string };

function base64url(eingabe: string | Buffer): string {
	return Buffer.from(eingabe).toString("base64url");
}

async function zugriffstoken(konto: Dienstkonto): Promise<string> {
	const jetzt = Math.floor(Date.now() / 1000);
	const kopf = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
	const inhalt = base64url(
		JSON.stringify({ iss: konto.client_email, scope: SCOPE, aud: TOKEN_URL, iat: jetzt, exp: jetzt + 3600 }),
	);
	const signatur = createSign("RSA-SHA256").update(`${kopf}.${inhalt}`).sign(konto.private_key);
	const antwort = await fetch(TOKEN_URL, {
		method: "POST",
		headers: { "content-type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
			assertion: `${kopf}.${inhalt}.${base64url(signatur)}`,
		}),
	});
	if (!antwort.ok) throw new Error(`Anmeldung fehlgeschlagen (${antwort.status}).`);
	const { access_token } = (await antwort.json()) as { access_token: string };
	return access_token;
}

export async function suchanfragen(start: string, ende: string, anzahl = 25): Promise<Suchzeile[]> {
	const kontoJson = process.env["GSC_SERVICE_ACCOUNT"];
	const property = process.env["GSC_SITE_URL"];
	if (!kontoJson || !property) {
		throw new Error("GSC_SERVICE_ACCOUNT und GSC_SITE_URL müssen gesetzt sein.");
	}
	const token = await zugriffstoken(JSON.parse(kontoJson) as Dienstkonto);
	const antwort = await fetch(
		`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`,
		{
			method: "POST",
			headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
			body: JSON.stringify({ startDate: start, endDate: ende, dimensions: ["query"], rowLimit: anzahl }),
		},
	);
	if (!antwort.ok) throw new Error(`Abfrage fehlgeschlagen (${antwort.status}).`);
	const daten = (await antwort.json()) as {
		rows?: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }[];
	};
	return (daten.rows ?? []).map((zeile) => ({
		begriff: zeile.keys[0] ?? "",
		klicks: zeile.clicks,
		impressionen: zeile.impressions,
		ctr: zeile.ctr,
		position: zeile.position,
	}));
}
