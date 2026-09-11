/** Reine Daten, ohne Dateizugriff — auch in Client-Komponenten verwendbar. */
export const hauptnavigation = [
	{ pfad: "/", titel: "Home" },
	{ pfad: "/nis2-nisg-2026", titel: "NIS2 & NISG 2026" },
	{ pfad: "/iso-27001", titel: "ISO 27001" },
	{ pfad: "/security-services", titel: "Security Services" },
	{ pfad: "/referenzen", titel: "Referenzen" },
	{ pfad: "/about", titel: "About" },
	{ pfad: "/kontakt", titel: "Kontakt" },
] as const;

export const rechtliches = [
	{ pfad: "/impressum", titel: "Impressum" },
	{ pfad: "/datenschutz", titel: "Datenschutz" },
	{ pfad: "/barrierefreiheit", titel: "Barrierefreiheit" },
] as const;
