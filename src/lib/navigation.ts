/**
 * Reine Daten, ohne Dateizugriff — auch in Client-Komponenten verwendbar.
 *
 * `verfuegbar` sagt, ob es die Seite schon gibt. Nicht verfügbare Einträge
 * erscheinen nicht in der Navigation: Next lädt verlinkte Routen im Voraus,
 * ein Verweis auf eine fehlende Seite erzeugt also echte 404-Abrufe im
 * Browser. Beim Anlegen der jeweiligen Seite wird der Wert umgestellt.
 */
export const hauptnavigation = [
	{ pfad: "/", titel: "Home", verfuegbar: true },
	{ pfad: "/nis2-nisg-2026", titel: "NIS2 & NISG 2026", verfuegbar: true },
	{ pfad: "/iso-27001", titel: "ISO 27001", verfuegbar: true },
	{ pfad: "/security-services", titel: "Security Services", verfuegbar: true },
	{ pfad: "/referenzen", titel: "Referenzen", verfuegbar: true },
	{ pfad: "/about", titel: "About", verfuegbar: true },
	{ pfad: "/kontakt", titel: "Kontakt", verfuegbar: true },
] as const;

export const rechtliches = [
	{ pfad: "/impressum", titel: "Impressum", verfuegbar: true },
	{ pfad: "/datenschutz", titel: "Datenschutz", verfuegbar: true },
	{ pfad: "/barrierefreiheit", titel: "Barrierefreiheit", verfuegbar: true },
] as const;

/**
 * Seiten außerhalb der Hauptnavigation. Dieselbe Regel: nicht verfügbare
 * Seiten werden nirgends verlinkt.
 */
export const unterseiten = [
	{ pfad: "/nis2-nisg-2026/betroffenheit-pruefen", titel: "Betroffenheit prüfen", verfuegbar: true },
	{ pfad: "/nis2-nisg-2026/fristen-und-registrierung", titel: "Fristen und Registrierung nach NISG 2026", verfuegbar: false },
	{ pfad: "/nis2-nisg-2026/haftung-der-geschaeftsfuehrung", titel: "Haftung der Geschäftsführung", verfuegbar: false },
	{ pfad: "/nis2-nisg-2026/lieferkette-und-fragebogen", titel: "Lieferkette und Lieferantenfragebogen", verfuegbar: false },
	{ pfad: "/iso-27001/ablauf-der-zertifizierung", titel: "Ablauf der ISO-27001-Zertifizierung", verfuegbar: false },
	{ pfad: "/iso-27001/interne-audits", titel: "Interne Audits nach ISO 27001", verfuegbar: false },
] as const;

const alle: readonly { pfad: string; verfuegbar: boolean }[] = [
	...hauptnavigation,
	...rechtliches,
	...unterseiten,
];

/** Gibt es die Seite schon? Unbekannte Pfade gelten als nicht vorhanden. */
export function istVerfuegbar(pfad: string): boolean {
	return alle.some((eintrag) => eintrag.pfad === pfad && eintrag.verfuegbar);
}
