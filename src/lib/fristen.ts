/**
 * Fristen nach dem NISG 2026, BGBl. I Nr. 94/2025, kundgemacht am 23.12.2025.
 *
 * Geprüft am Gesetzestext im RIS, im authentischen Bundesgesetzblatt und in
 * der konsolidierten Fassung vom 01.10.2026. Beide stimmen überein.
 *
 * Das Gesetz selbst nennt keine Kalenderdaten, sondern Fristen („innerhalb
 * von drei Monaten ab Inkrafttreten“). Die Kalenderdaten sind die, die die
 * Wirtschaftskammer Österreich für diese Fristen angibt. Die Berechnung
 * einer Monatsfrist wird bewusst nicht selbst angestellt.
 *
 * Formulierungen ohne Zeitform („Inkrafttreten“ statt „tritt in Kraft“),
 * damit der Block nach dem Stichtag nicht falsch wird.
 */
export const fristen = [
	{
		datum: "2026-10-01",
		anzeige: "1. Oktober 2026",
		was: "Inkrafttreten des NISG 2026.",
		fundstelle:
			"§ 51 Abs. 1 NISG 2026: neun Monate nach der Kundmachung, mit dem nächstfolgenden Monatsersten.",
	},
	{
		datum: "2026-12-31",
		anzeige: "31. Dezember 2026",
		was: "Letzter Tag für die Registrierung wesentlicher und wichtiger Einrichtungen bei der Cybersicherheitsbehörde, elektronisch über das Unternehmensserviceportal. Wer erst später unter das Gesetz fällt, hat drei Monate ab Erfüllung der Voraussetzungen.",
		fundstelle:
			"§ 29 Abs. 3 NISG 2026: innerhalb von drei Monaten ab Inkrafttreten.",
	},
	{
		datum: "2027-09-30",
		anzeige: "30. September 2027",
		was: "Letzter Tag für die Selbstdeklaration: Informationen zu den umgesetzten Risikomanagementmaßnahmen an die Cybersicherheitsbehörde.",
		fundstelle:
			"§ 33 Abs. 1 NISG 2026: innerhalb von zwölf Monaten nach Eintritt der Registrierungspflicht.",
	},
] as const;

export const fristenQuellen = {
	gesetz:
		"https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20013065",
	kalenderdaten: "https://www.wko.at/it-sicherheit/nis-faq",
} as const;
