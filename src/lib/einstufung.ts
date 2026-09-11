/**
 * Einstufung nach dem NISG 2026 — die Regeln des Selbstchecks.
 *
 * Grundlage: BGBl. I Nr. 94/2025, geprüft am authentischen Bundesgesetzblatt,
 * an der konsolidierten Fassung vom 01.10.2026 und an den amtlichen PDFs der
 * Anlagen 1 und 2. Jede Regel verweist auf die Bestimmung, aus der sie folgt.
 *
 * Grundsatz: Es wird nichts vermutet. Ist eine Antwort unbekannt, werden alle
 * möglichen Werte durchgerechnet. Führen sie zu verschiedenen Ergebnissen,
 * lautet das Ergebnis „Einzelfallprüfung“ — nicht die wahrscheinlichste Variante.
 *
 * Diese Datei hat bewusst keine Importe: Sie läuft unverändert im Browser und
 * unter node:test.
 */

/** Größenunabhängige oder behördlich festgelegte Arten von Einrichtungen. */
export type Sonderart =
	| "keine"
	| "qualifizierter-vertrauensdienst" // § 24 Abs. 1 Z 1 lit. a
	| "tld-namenregister" // § 24 Abs. 1 Z 1 lit. b
	| "dns-dienst" // § 24 Abs. 1 Z 1 lit. c
	| "bundesverwaltung" // § 24 Abs. 1 Z 1 lit. d
	| "bescheid-wesentlich" // § 24 Abs. 1 Z 1 lit. e, § 26
	| "kritische-einrichtung" // § 24 Abs. 1 Z 1 lit. f, Richtlinie (EU) 2022/2557
	| "kommunikation" // § 24 Abs. 1 Z 2 und Abs. 2 Z 3 lit. a
	| "vertrauensdienst" // § 24 Abs. 2 Z 3 lit. b
	| "landesverwaltung" // § 24 Abs. 2 Z 2
	| "bescheid-wichtig" // § 24 Abs. 2 Z 3 lit. c, § 26
	| "unklar";

export type Mitarbeiter = "unter-50" | "50-249" | "ab-250" | "unklar";
export type Umsatz = "bis-10" | "ueber-10" | "ueber-50" | "unklar";
export type Bilanz = "bis-10" | "ueber-10" | "ueber-43" | "unklar";
export type Gruppe = "nein" | "ja" | "ja-unklar";
export type Niederlassung = "oesterreich" | "andere-eu" | "ausserhalb-eu" | "unklar";

export type Antworten = {
	sonderart: Sonderart;
	/** Anlage des gewählten Sektors, null für „keiner der Sektoren“. */
	anlage: 1 | 2 | null | "unklar";
	/** Bankwesen oder Finanzmarktinfrastrukturen: Hinweis auf § 27. */
	finanzsektor: boolean;
	/**
	 * Cloud, Rechenzentren, Inhaltszustellnetze, MSP, MSSP, DNS, TLD,
	 * Online-Marktplätze, -Suchmaschinen, soziale Netzwerke: Für sie gilt die
	 * Hauptniederlassung statt jeder Niederlassung (§ 28 Abs. 2 Z 2).
	 */
	hauptniederlassungsregel: boolean;
	mitarbeiter: Mitarbeiter;
	umsatz: Umsatz;
	bilanz: Bilanz;
	gruppe: Gruppe;
	niederlassung: Niederlassung;
};

export type Einstufung = "wesentlich" | "wichtig" | "nicht-erfasst" | "einzelfall";

export type Ergebnis = {
	einstufung: Einstufung;
	/** Warum — jeweils mit Fundstelle. */
	gruende: string[];
	/** Was zusätzlich zu beachten ist. */
	hinweise: string[];
};

type Groesse = "klein" | "mittel" | "gross";

const MITARBEITER_WERTE = ["unter-50", "50-249", "ab-250"] as const;
const UMSATZ_WERTE = ["bis-10", "ueber-10", "ueber-50"] as const;
const BILANZ_WERTE = ["bis-10", "ueber-10", "ueber-43"] as const;

/**
 * § 25 Abs. 2: groß ist, wer zumindest 250 Mitarbeiter beschäftigt oder einen
 * Jahresumsatz von über 50 Millionen Euro erzielt UND eine Jahresbilanzsumme
 * von über 43 Millionen Euro hat.
 * § 25 Abs. 3: mittel ist, wer zumindest 50 Mitarbeiter beschäftigt oder einen
 * Jahresumsatz von über zehn Millionen Euro erzielt UND eine Jahresbilanzsumme
 * von über zehn Millionen Euro hat, sofern nicht schon groß.
 * Das Gesetz verknüpft Umsatz und Bilanzsumme mit „und“; so wird es hier
 * umgesetzt, auch wenn die KMU-Empfehlung 2003/361/EG anders formuliert ist.
 */
function groesseAus(
	mitarbeiter: (typeof MITARBEITER_WERTE)[number],
	umsatz: (typeof UMSATZ_WERTE)[number],
	bilanz: (typeof BILANZ_WERTE)[number],
): Groesse {
	if (mitarbeiter === "ab-250") return "gross";
	if (umsatz === "ueber-50" && bilanz === "ueber-43") return "gross";
	if (mitarbeiter === "50-249") return "mittel";
	if (umsatz !== "bis-10" && bilanz !== "bis-10") return "mittel";
	return "klein";
}

/** Alle Größenklassen, die mit den Antworten vereinbar sind. */
export function moeglicheGroessen(
	mitarbeiter: Mitarbeiter,
	umsatz: Umsatz,
	bilanz: Bilanz,
): Set<Groesse> {
	const m = mitarbeiter === "unklar" ? MITARBEITER_WERTE : [mitarbeiter];
	const u = umsatz === "unklar" ? UMSATZ_WERTE : [umsatz];
	const b = bilanz === "unklar" ? BILANZ_WERTE : [bilanz];
	const ergebnis = new Set<Groesse>();
	for (const mi of m) for (const um of u) for (const bi of b) ergebnis.add(groesseAus(mi, um, bi));
	return ergebnis;
}

/**
 * Einstufung für eine feststehende Größenklasse und eine feststehende Anlage.
 * Reihenfolge der Prüfung wie in § 24: erst wesentlich (Abs. 1), dann
 * wichtig (Abs. 2), sonst nicht erfasst.
 */
function einstufungFuer(
	sonderart: Exclude<Sonderart, "unklar">,
	anlage: 1 | 2 | null,
	groesse: Groesse,
): { einstufung: Exclude<Einstufung, "einzelfall">; grund: string } {
	switch (sonderart) {
		case "qualifizierter-vertrauensdienst":
			return { einstufung: "wesentlich", grund: "Qualifizierte Vertrauensdiensteanbieter gelten unabhängig von der Unternehmensgröße als wesentliche Einrichtung (§ 24 Abs. 1 Z 1 lit. a)." };
		case "tld-namenregister":
			return { einstufung: "wesentlich", grund: "TLD-Namenregister gelten unabhängig von der Unternehmensgröße als wesentliche Einrichtung (§ 24 Abs. 1 Z 1 lit. b)." };
		case "dns-dienst":
			return { einstufung: "wesentlich", grund: "DNS-Diensteanbieter gelten unabhängig von der Unternehmensgröße als wesentliche Einrichtung (§ 24 Abs. 1 Z 1 lit. c)." };
		case "bundesverwaltung":
			return { einstufung: "wesentlich", grund: "Einrichtungen der öffentlichen Verwaltung auf Bundesebene gelten als wesentliche Einrichtung (§ 24 Abs. 1 Z 1 lit. d)." };
		case "bescheid-wesentlich":
			return { einstufung: "wesentlich", grund: "Die Cybersicherheitsbehörde hat die Einrichtung per Bescheid als wesentlich eingestuft (§ 24 Abs. 1 Z 1 lit. e, § 26)." };
		case "kritische-einrichtung":
			return { einstufung: "wesentlich", grund: "Als kritische Einrichtung nach der Richtlinie (EU) 2022/2557 ermittelte Einrichtungen gelten als wesentlich (§ 24 Abs. 1 Z 1 lit. f)." };
		case "kommunikation":
			// § 24 Abs. 1 Z 2: mittlere Anbieter öffentlicher Kommunikationsnetze
			// oder -dienste sind wesentlich. Große sind es über Anlage 1
			// (Digitale Infrastruktur) und Abs. 1 Z 3 ebenfalls. Kleinere sind nach
			// Abs. 2 Z 3 lit. a unabhängig von der Größe wichtig.
			return groesse === "klein"
				? { einstufung: "wichtig", grund: "Anbieter öffentlicher elektronischer Kommunikationsnetze oder -dienste gelten unabhängig von der Größe zumindest als wichtige Einrichtung (§ 24 Abs. 2 Z 3 lit. a)." }
				: { einstufung: "wesentlich", grund: "Anbieter öffentlicher elektronischer Kommunikationsnetze oder -dienste, die zumindest ein mittleres Unternehmen betreiben, gelten als wesentliche Einrichtung (§ 24 Abs. 1 Z 2 und Z 3)." };
		case "vertrauensdienst":
			// Nicht qualifizierte Vertrauensdiensteanbieter: wichtig unabhängig
			// von der Größe (§ 24 Abs. 2 Z 3 lit. b) — außer sie sind über
			// Anlage 1 und Größe bereits wesentlich (§ 24 Abs. 2 letzter Halbsatz).
			return anlage === 1 && groesse === "gross"
				? { einstufung: "wesentlich", grund: "Einrichtungen der Anlage 1, die ein großes Unternehmen betreiben, gelten als wesentliche Einrichtung (§ 24 Abs. 1 Z 3)." }
				: { einstufung: "wichtig", grund: "Vertrauensdiensteanbieter gelten unabhängig von der Größe zumindest als wichtige Einrichtung (§ 24 Abs. 2 Z 3 lit. b)." };
		case "landesverwaltung":
			return { einstufung: "wichtig", grund: "Einrichtungen der öffentlichen Verwaltung auf Landesebene gelten als wichtige Einrichtung (§ 24 Abs. 2 Z 2)." };
		case "bescheid-wichtig":
			return { einstufung: "wichtig", grund: "Die Cybersicherheitsbehörde hat die Einrichtung per Bescheid als wichtig eingestuft (§ 24 Abs. 2 Z 3 lit. c, § 26)." };
		case "keine":
			if (anlage === 1 && groesse === "gross") {
				return { einstufung: "wesentlich", grund: "Einrichtungen der Anlage 1, die ein großes Unternehmen betreiben, gelten als wesentliche Einrichtung (§ 24 Abs. 1 Z 3)." };
			}
			if (anlage !== null && groesse !== "klein") {
				return { einstufung: "wichtig", grund: `Einrichtungen der Anlage ${anlage}, die ein ${groesse === "gross" ? "großes" : "mittleres"} Unternehmen betreiben und nicht schon wesentlich sind, gelten als wichtige Einrichtung (§ 24 Abs. 2 Z 1).` };
			}
			if (anlage !== null) {
				return { einstufung: "nicht-erfasst", grund: "Die Tätigkeit fällt unter eine der Anlagen, das Unternehmen erreicht aber die Schwellen eines mittleren Unternehmens nicht (§ 24 in Verbindung mit § 25 Abs. 3)." };
			}
			return { einstufung: "nicht-erfasst", grund: "Die Tätigkeit fällt unter keinen der in den Anlagen 1 und 2 genannten Sektoren und unter keine größenunabhängige Sonderregel (§ 24)." };
	}
}

export function einstufen(a: Antworten): Ergebnis {
	const hinweise: string[] = [];

	// Territorialität, § 28. Öffentliche Verwaltung gilt unabhängig vom
	// Niederlassungsort in der EU (Abs. 2 Z 3); Kommunikationsanbieter,
	// sofern sie Dienste in Österreich erbringen (Abs. 2 Z 1).
	const verwaltung = a.sonderart === "bundesverwaltung" || a.sonderart === "landesverwaltung";
	if (!verwaltung && a.niederlassung !== "oesterreich") {
		if (a.niederlassung === "unklar" || a.niederlassung === "ausserhalb-eu" || a.sonderart === "kommunikation") {
			return {
				einstufung: "einzelfall",
				gruende: [
					a.hauptniederlassungsregel
						? "Für diese Art von Diensten entscheidet die Hauptniederlassung in der EU, bei fehlender EU-Niederlassung auch die Bestellung eines Vertreters (§ 28 Abs. 2 Z 2 und Abs. 3)."
						: a.sonderart === "kommunikation"
							? "Kommunikationsanbieter sind erfasst, sofern sie ihre Dienste in Österreich erbringen — unabhängig von der Niederlassung (§ 28 Abs. 2 Z 1)."
							: "Erfasst sind grundsätzlich Einrichtungen, die in Österreich niedergelassen sind (§ 28 Abs. 1). Ohne Klarheit über die Niederlassung ist keine Einstufung möglich.",
				],
				hinweise,
			};
		}
		return {
			einstufung: "nicht-erfasst",
			gruende: [
				a.hauptniederlassungsregel
					? "Die Hauptniederlassung liegt in einem anderen EU-Mitgliedstaat. Für diese Art von Diensten ist dessen Recht maßgeblich, nicht das NISG 2026 (§ 28 Abs. 2 Z 2 und Abs. 3)."
					: "Das NISG 2026 erfasst Einrichtungen, die in Österreich niedergelassen sind (§ 28 Abs. 1). Für Niederlassungen in anderen Mitgliedstaaten gilt deren Umsetzung der NIS2-Richtlinie.",
			],
			hinweise: ["Die NIS2-Richtlinie gilt in der ganzen EU. Prüfen Sie, ob Sie nach dem Recht des Mitgliedstaats Ihrer Niederlassung erfasst sind."],
		};
	}

	if (a.sonderart === "unklar" || a.anlage === "unklar") {
		return {
			einstufung: "einzelfall",
			gruende: [
				a.sonderart === "unklar"
					? "Ob eine größenunabhängige Sonderregel greift, hängt von der genauen Art der Einrichtung ab (§ 24 Abs. 1 Z 1 und Abs. 2 Z 3)."
					: "Welcher Anlage die Tätigkeit zuzuordnen ist, hängt von der genauen Art der Einrichtung ab, die die Anlagen 1 und 2 oft mit Verweis auf Fachgesetze festlegen.",
			],
			hinweise,
		};
	}

	// Konzernzugehörigkeit, § 25 Abs. 1 und 4.
	if (a.gruppe === "ja-unklar" && a.anlage !== null && a.sonderart === "keine") {
		return {
			einstufung: "einzelfall",
			gruende: [
				"Ob die Zahlen von Partner- und verbundenen Unternehmen mitgerechnet werden, hängt davon ab, ob Ihre Netz- und Informationssysteme organisatorisch, technisch und operativ unabhängig vom Konzern sind (§ 25 Abs. 4). Davon kann die Einstufung abhängen.",
			],
			hinweise,
		};
	}
	if (a.gruppe === "ja") {
		hinweise.push("Die Einstufung beruht auf den von Ihnen angegebenen Zahlen. Nach § 25 Abs. 1 in Verbindung mit der Empfehlung 2003/361/EG zählen Partner- und verbundene Unternehmen grundsätzlich mit, außer Ihre Netz- und Informationssysteme sind vom Konzern unabhängig (§ 25 Abs. 4).");
	}

	// Alle mit den Antworten vereinbaren Größen durchrechnen.
	const groessen = moeglicheGroessen(a.mitarbeiter, a.umsatz, a.bilanz);
	const varianten = [...groessen].map((g) => einstufungFuer(a.sonderart as Exclude<Sonderart, "unklar">, a.anlage as 1 | 2 | null, g));
	const einstufungen = new Set(varianten.map((v) => v.einstufung));

	if (einstufungen.size > 1) {
		return {
			einstufung: "einzelfall",
			gruende: [
				"Mit den angegebenen Zahlen ist die Unternehmensgröße nicht eindeutig bestimmbar, und davon hängt die Einstufung ab (§ 25 Abs. 2 und 3). Mitarbeiterzahl, Jahresumsatz und Jahresbilanzsumme des letzten abgeschlossenen Geschäftsjahres klären das.",
			],
			hinweise,
		};
	}

	const ergebnis = varianten[0];
	if (!ergebnis) {
		return { einstufung: "einzelfall", gruende: ["Keine Einstufung möglich."], hinweise };
	}

	if (ergebnis.einstufung === "nicht-erfasst" && a.anlage !== null) {
		hinweise.push("Die Cybersicherheitsbehörde kann auch kleinere Einrichtungen per Bescheid einstufen, etwa wenn sie der einzige Anbieter eines unerlässlichen Dienstes sind oder eine Störung die öffentliche Sicherheit berühren könnte (§ 26 Abs. 1 und 3).");
	}
	if (a.finanzsektor && ergebnis.einstufung !== "nicht-erfasst") {
		hinweise.push("Im Finanzsektor gelten die Risikomanagement- und Meldepflichten des NISG 2026 insoweit nicht, als sektorspezifisches Unionsrecht gleichwertige Pflichten vorsieht (§ 27). Die Registrierung nach § 29 bleibt davon unberührt.");
	}

	return { einstufung: ergebnis.einstufung, gruende: [ergebnis.grund], hinweise };
}

/** Folgepflichten je Einstufung, mit Fundstelle. Kalenderdaten kommen aus src/lib/fristen.ts. */
export function pflichten(einstufung: Einstufung): string[] {
	if (einstufung !== "wesentlich" && einstufung !== "wichtig") return [];
	const gemeinsam = [
		"Registrierung bei der Cybersicherheitsbehörde (§ 29).",
		"Die Leitungsorgane stellen die Umsetzung der Risikomanagementmaßnahmen sicher, beaufsichtigen sie und nehmen an Cybersicherheitsschulungen teil; Mitarbeitern sind regelmäßig Schulungen anzubieten (§ 31).",
		"Geeignete und verhältnismäßige Risikomanagementmaßnahmen mit zehn Mindestinhalten umsetzen (§ 32).",
		"Selbstdeklaration zu den umgesetzten Maßnahmen an die Behörde (§ 33 Abs. 1).",
		"Erhebliche Cybersicherheitsvorfälle melden: Frühwarnung binnen 24 Stunden, Meldung binnen 72 Stunden, Abschlussbericht spätestens einen Monat danach (§ 34).",
	];
	return einstufung === "wesentlich"
		? [
				...gemeinsam,
				"Auf Aufforderung Nachweis durch eine unabhängige Stelle; die operative und organisatorische Umsetzung ist dabei binnen zwei Monaten nachzuweisen (§ 33 Abs. 2).",
				"Die Behörde kann von sich aus kontrollieren, Sicherheitsscans durchführen und Ad-hoc-Prüfungen anordnen (§ 38 Abs. 1).",
			]
		: [
				...gemeinsam,
				"Auf Aufforderung Nachweis durch eine unabhängige Stelle binnen zwei Jahren (§ 33 Abs. 2).",
				"Die Behörde wird vor allem tätig, wenn Nachweise oder begründete Hinweise auf Verstöße vorliegen (§ 38 Abs. 2).",
			];
}
