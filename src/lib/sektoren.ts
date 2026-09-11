/**
 * Sektoren nach dem NISG 2026, zugeordnet zu den Anlagen.
 *
 * Quelle: Anlage 1 „Sektoren mit hoher Kritikalität“ (RIS NOR40273915) und
 * Anlage 2 „Sonstige kritische Sektoren“ (RIS NOR40273914), BGBl. I
 * Nr. 94/2025. Die Reihenfolge entspricht § 2 und den Anlagen.
 *
 * Die Anlagen bestimmen innerhalb jedes Sektors die Arten von Einrichtungen
 * teils sehr genau, mit Verweisen auf Fachgesetze (etwa ElWOG, GWG, PMG,
 * NACE-Abteilungen). Diese Liste bildet nur die Sektorebene ab. Wer die
 * genaue Art prüfen will, braucht die Anlage selbst.
 */
export const sektoren = [
	{ id: "energie", name: "Energie", anlage: 1 },
	{ id: "verkehr", name: "Verkehr", anlage: 1 },
	{ id: "bankwesen", name: "Bankwesen", anlage: 1 },
	{ id: "finanzmarktinfrastrukturen", name: "Finanzmarktinfrastrukturen", anlage: 1 },
	{ id: "gesundheitswesen", name: "Gesundheitswesen", anlage: 1 },
	{ id: "trinkwasser", name: "Trinkwasser", anlage: 1 },
	{ id: "abwasser", name: "Abwasser", anlage: 1 },
	{ id: "digitale-infrastruktur", name: "Digitale Infrastruktur", anlage: 1 },
	{ id: "ikt-dienste-b2b", name: "Verwaltung von IKT-Diensten (Business-to-Business)", anlage: 1 },
	{ id: "oeffentliche-verwaltung", name: "Öffentliche Verwaltung", anlage: 1 },
	{ id: "weltraum", name: "Weltraum", anlage: 1 },
	{ id: "post-kurier", name: "Post- und Kurierdienste", anlage: 2 },
	{ id: "abfall", name: "Abfallbewirtschaftung", anlage: 2 },
	{ id: "chemie", name: "Produktion, Herstellung und Handel mit chemischen Stoffen", anlage: 2 },
	{ id: "lebensmittel", name: "Produktion, Verarbeitung und Vertrieb von Lebensmitteln", anlage: 2 },
	{ id: "verarbeitendes-gewerbe", name: "Verarbeitendes Gewerbe und Herstellung von Waren", anlage: 2 },
	{ id: "digitale-dienste", name: "Anbieter digitaler Dienste", anlage: 2 },
	{ id: "forschung", name: "Forschung", anlage: 2 },
] as const;

export type SektorId = (typeof sektoren)[number]["id"];

export const anlagenTitel = {
	1: "Anlage 1: Sektoren mit hoher Kritikalität",
	2: "Anlage 2: Sonstige kritische Sektoren",
} as const;

export const anlagenQuelle = {
	1: "https://www.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40273915/I_94_2025__Anlage_1.pdf",
	2: "https://www.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40273914/I_94_2025__Anlage_2.pdf",
} as const;
