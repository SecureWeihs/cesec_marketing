/**
 * Reichweitenmessung mit einer selbst betriebenen Umami-Instanz.
 *
 * Standard ist AUS. Nur wenn beide Umgebungsvariablen gesetzt sind, wird das
 * Skript eingebunden — und nur dann erscheint das zugehörige Kapitel in der
 * Datenschutzerklärung. Messung und Erklärung schalten sich gemeinsam.
 *
 *   UMAMI_HOST                      Adresse der Umami-Instanz, etwa
 *                                   https://umami-cesec.vercel.app (nur serverseitig)
 *   NEXT_PUBLIC_UMAMI_WEBSITE_ID    Kennung der Website in Umami
 *
 * Der Browser spricht nie mit der Umami-Instanz direkt: Skript und Messpunkte
 * liegen unter /stats auf dem eigenen Origin und werden serverseitig
 * weitergeleitet (next.config.ts). Die Content-Security-Policy bleibt bei
 * 'self'; es kommt kein zusätzlicher Host hinzu.
 */
export const analyse = {
	aktiv: Boolean(process.env["UMAMI_HOST"] && process.env["NEXT_PUBLIC_UMAMI_WEBSITE_ID"]),
	websiteId: process.env["NEXT_PUBLIC_UMAMI_WEBSITE_ID"] ?? "",
	pfad: "/stats",
	/**
	 * Wie oft der Salt für die Besucherkennung wechselt. Muss mit der Variable
	 * SALT_ROTATION der Umami-Instanz übereinstimmen („day“ empfohlen; Umami
	 * nimmt ohne Angabe „month“). Steht so in der Datenschutzerklärung.
	 */
	saltWechsel: "day" as "day" | "week" | "month",
	/**
	 * TODO(inhaber): Speicherdauer der Messdaten in Monaten festlegen und in der
	 * Umami-Instanz entsprechend löschen lassen. Solange null, bricht der Build
	 * ab, sobald die Messung eingeschaltet wird — eine Datenschutzerklärung ohne
	 * Speicherdauer darf nicht live gehen.
	 */
	aufbewahrungMonate: null as number | null,
	/** TODO(inhaber): Betreiber und Region der Datenbank, sobald eingerichtet. */
	datenbank: null as { anbieter: string; region: string } | null,
} as const;

if (analyse.aktiv && (analyse.aufbewahrungMonate === null || analyse.datenbank === null)) {
	throw new Error(
		"Reichweitenmessung ist eingeschaltet, aber Speicherdauer oder Datenbank sind in src/lib/analyse.ts nicht festgelegt. " +
			"Ohne diese Angaben wäre die Datenschutzerklärung unvollständig.",
	);
}

/**
 * Anonyme Zählereignisse (Abschnitt 12 des Briefs). Nur der Name des
 * Ereignisses wird gezählt, niemals ein Inhalt, eine Eingabe oder ein Wert.
 */
export const ereignisse = {
	telefon: "telefon",
	email: "email",
	selbstcheck: "selbstcheck-abgeschlossen",
} as const;
