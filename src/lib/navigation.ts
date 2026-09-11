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
	{ pfad: "/nis2-nisg-2026", titel: "NIS2 & NISG 2026", verfuegbar: false },
	{ pfad: "/iso-27001", titel: "ISO 27001", verfuegbar: false },
	{ pfad: "/security-services", titel: "Security Services", verfuegbar: false },
	{ pfad: "/referenzen", titel: "Referenzen", verfuegbar: false },
	{ pfad: "/about", titel: "About", verfuegbar: false },
	{ pfad: "/kontakt", titel: "Kontakt", verfuegbar: false },
] as const;

export const rechtliches = [
	{ pfad: "/impressum", titel: "Impressum", verfuegbar: true },
	{ pfad: "/datenschutz", titel: "Datenschutz", verfuegbar: true },
	{ pfad: "/barrierefreiheit", titel: "Barrierefreiheit", verfuegbar: true },
] as const;
