/**
 * Einzige Quelle für Stammdaten im Code.
 *
 * Ab Schritt 3 wird diese Datei aus content/impressum.yaml erzeugt, damit
 * Impressum, JSON-LD und NAP.md nie auseinanderlaufen (Abschnitt 11 und 13).
 * Bis dahin gilt sie als Vorstufe; die Werte sind in OFFENE-PUNKTE.md belegt.
 */
export const site = {
	name: "Cesec e. U.",
	inhaber: "Dipl.-Ing. Sascha Weihs",
	url: "https://cesec.at",
	sprache: "de-AT",
	telefon: {
		anzeige: "+43 650 66 33 004",
		e164: "+436506633004",
	},
	/** Genau eine E-Mail-Adresse im gesamten Auftritt, Abschnitt 7.8. */
	email: "sw@cesec.at",
	anschrift: {
		strasse: "Leithenholzweg 1",
		plz: "3052",
		ort: "Innermanzing",
		land: "Österreich",
		landCode: "AT",
	},
	linkedin: "https://www.linkedin.com/in/sascha-weihs/",
} as const;

export const hauptnavigation = [
	{ pfad: "/", titel: "Home" },
	{ pfad: "/nis2-nisg-2026", titel: "NIS2 & NISG 2026" },
	{ pfad: "/iso-27001", titel: "ISO 27001" },
	{ pfad: "/security-services", titel: "Security Services" },
	{ pfad: "/referenzen", titel: "Referenzen" },
	{ pfad: "/about", titel: "About" },
	{ pfad: "/kontakt", titel: "Kontakt" },
] as const;
