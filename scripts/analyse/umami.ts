/**
 * Kennzahlen eines Zeitraums aus der eigenen Umami-Instanz.
 *
 * API nach dem Quellcode von Umami 3.3.1:
 *   POST /api/auth/login                       { username, password } → { token }
 *   GET  /api/websites/{id}/stats              → pageviews, visitors, visits, bounces, totaltime
 *   GET  /api/websites/{id}/metrics?type=…     → [{ x, y }]  (type: path, referrer, event)
 * Der Zeitraum geht als startDate/endDate (ISO) mit, nicht als Zeitstempel.
 *
 * Der Lesebenutzer darf keine Zwei-Faktor-Anmeldung haben — dann antwortet
 * die Anmeldung nur mit einem Teil-Token und das Skript bricht mit Hinweis ab.
 */
import type { Monatsdaten } from "./bericht.ts";

type Zeile = { x: string | null; y: number };

function umgebung(name: string): string {
	const wert = process.env[name];
	if (!wert) throw new Error(`${name} ist nicht gesetzt.`);
	return wert;
}

export async function umamiMonat(start: string, ende: string): Promise<NonNullable<Monatsdaten["umami"]>> {
	const host = umgebung("UMAMI_HOST").replace(/\/$/, "");
	const website = umgebung("NEXT_PUBLIC_UMAMI_WEBSITE_ID");

	const anmeldung = await fetch(`${host}/api/auth/login`, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ username: umgebung("UMAMI_BENUTZER"), password: umgebung("UMAMI_PASSWORT") }),
	});
	if (!anmeldung.ok) throw new Error(`Anmeldung fehlgeschlagen (${anmeldung.status}).`);
	const antwort = (await anmeldung.json()) as { token?: string; requiresTwoFactor?: boolean };
	if (antwort.requiresTwoFactor) {
		throw new Error("Der Lesebenutzer hat die Zwei-Faktor-Anmeldung aktiv; das Skript kann sich so nicht anmelden.");
	}
	if (!antwort.token) throw new Error("Anmeldung ohne Token beantwortet.");

	const zeitraum = new URLSearchParams({ startDate: `${start}T00:00:00Z`, endDate: `${ende}T23:59:59Z` });
	const abruf = async <T>(pfad: string, zusatz: Record<string, string> = {}): Promise<T> => {
		const parameter = new URLSearchParams({ ...Object.fromEntries(zeitraum), ...zusatz });
		const r = await fetch(`${host}/api/websites/${website}/${pfad}?${parameter}`, {
			headers: { authorization: `Bearer ${antwort.token}` },
		});
		if (!r.ok) throw new Error(`${pfad} fehlgeschlagen (${r.status}).`);
		return (await r.json()) as T;
	};

	const [kennzahlen, seiten, quellen, ereignisse] = await Promise.all([
		abruf<{ pageviews: number; visitors: number; visits: number }>("stats"),
		abruf<Zeile[]>("metrics", { type: "path", limit: "10" }),
		abruf<Zeile[]>("metrics", { type: "referrer", limit: "10" }),
		abruf<Zeile[]>("metrics", { type: "event", limit: "20" }),
	]);

	return {
		besuche: Number(kennzahlen.visits),
		besucher: Number(kennzahlen.visitors),
		seitenaufrufe: Number(kennzahlen.pageviews),
		seiten: seiten.map((z) => ({ pfad: z.x ?? "", aufrufe: Number(z.y) })),
		quellen: quellen.map((z) => ({ quelle: z.x ?? "", besuche: Number(z.y) })),
		ereignisse: ereignisse.map((z) => ({ name: z.x ?? "", anzahl: Number(z.y) })),
	};
}
