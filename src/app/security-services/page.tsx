import type { Metadata } from "next";
import { leistung } from "@/lib/strukturierte-daten";
import { site } from "@/lib/site";
import { Handlung } from "@/components/handlung";
import { Leistungsseite } from "@/components/leistungsseite";
import { StrukturierteDaten } from "@/components/strukturierte-daten";

export const metadata: Metadata = {
	title: "Security Services: CISO as a Service, Audits, BCM",
	description:
		"CISO as a Service, interne Audits und Lieferantenaudits, IKT-Risikomanagement, BCM, Vorfallmanagement und Meldepflichten sowie Automatisierung von Kontrollen.",
	openGraph: { images: [{ url: "/og/leistung.png", width: 1200, height: 630 }] },
};

/*
 * Erfahrungsangaben stammen aus dem Beraterprofil. DORA erscheint hier als
 * genau ein Absatz, wie im Brief (Abschnitt 5) festgelegt. Die frühere
 * KI-Aussage aus Abschnitt 7.9 entfällt auf Anweisung des Inhabers.
 */

const LEISTUNGEN = [
	{
		id: "ciso-as-a-service",
		titel: "CISO as a Service",
		absaetze: [
			"Viele Unternehmen brauchen einen Informationssicherheitsbeauftragten, aber keine Vollzeitstelle — oder finden niemanden, der Regulatorik, Technik und das Gespräch mit der Geschäftsleitung zugleich beherrscht. Als externer Informationssicherheitsbeauftragter übernehme ich die Rolle mit allem, was dazugehört: Richtlinien, Risikobewertung, Schutzbedarfsfeststellungen, Begleitung von Projekten und Änderungen, Behandlung von Sicherheitsvorfällen und regelmäßige Berichte an die Geschäftsführung.",
			"Für Leitungsorgane ist das mehr als eine Arbeitsentlastung. Das NISG 2026 verpflichtet sie, die Umsetzung der Risikomanagementmaßnahmen sicherzustellen und zu beaufsichtigen (§ 31 Abs. 1). Beaufsichtigen kann nur, wer regelmäßig einen Bericht bekommt, den er versteht, und eine Person hat, die er fragen kann.",
			"Die Rolle ist auf Dauer angelegt, aber nicht auf Abhängigkeit. Prozesse und Dokumentation werden so aufgebaut, dass sie ohne mich nachvollziehbar bleiben. Wenn Sie die Funktion später intern besetzen, übergebe ich einen laufenden Betrieb, keinen Aktenschrank.",
		],
	},
	{
		id: "audits",
		titel: "Interne Audits und Lieferantenaudits",
		absaetze: [
			"Interne Audits nach ISO/IEC 27001 und Audits bei Dienstleistern und Lieferanten, deren Ausfall oder Kompromittierung Sie treffen würde. Aus mehrjähriger Auditpraxis in einem zertifizierten IT-Dienstleister kenne ich die typischen Prüfgebiete aus erster Hand: Berechtigungen, Business Continuity, Kryptographie, Asset-Management, physische Sicherheit, On- und Offboarding.",
			"Lieferantenaudits gewinnen an Gewicht, seit die Sicherheit der Lieferkette ausdrücklich zu den Risikomanagementmaßnahmen gehört, die das NISG 2026 verlangt (§ 32 Abs. 4). Ein ausgefüllter Fragebogen des Lieferanten ist dafür ein Anfang, aber kein Nachweis. Ein Audit prüft, ob hinter den Antworten gelebte Praxis steht.",
			"Ein Audit ist nur so gut wie seine Feststellungen. Jede ist so formuliert, dass sie einer externen Prüfung standhält — mit Bezug auf die Anforderung, konkretem Befund und dem Nachweis, auf den er sich stützt. Dazu eine Einschätzung, welche Feststellungen dringlich sind und welche warten können.",
		],
	},
	{
		id: "ikt-risikomanagement",
		titel: "IKT-Risikomanagement",
		absaetze: [
			"Methodik, Bewertung, Behandlung und Bericht an Leitungsorgane und Aufsicht. In einem beaufsichtigten Kreditinstitut habe ich das IKT-Risikomanagement aufgebaut und geführt, davor bei einem IT-Dienstleister nahezu alle Prozesse im Risikomanagement automatisiert, einschließlich eines laufend aktuellen Risiko-Dashboards. Methodisch stütze ich mich auf ISO/IEC 27005, in der Praxis auch auf Werkzeuge wie CRISAM.",
			"Risikomanagement scheitert selten an der Methode, sondern daran, dass die Bewertung einmal im Jahr stattfindet und dazwischen niemand hinsieht. Ein Risiko, das im Frühjahr als gering eingestuft wurde, ist nach einer Systemumstellung im Herbst vielleicht keines mehr — oder ein größeres. Das Ziel ist ein Verfahren, das mit dem Betrieb Schritt hält.",
			"Und eines, dessen Ergebnisse die Geschäftsführung ohne Übersetzung lesen kann: Welche Risiken sind akzeptiert, von wem, mit welcher Begründung, und welche Maßnahmen sind offen? Genau diese Fragen stellt auch jede Prüfung.",
		],
	},
	{
		id: "bcm",
		titel: "Business Continuity Management und Business-Impact-Analyse",
		absaetze: [
			"Welche Prozesse dürfen wie lange ausfallen, und was passiert, wenn sie es tun? Die Business-Impact-Analyse beantwortet die erste Frage, Notfallpläne und Übungen die zweite. Grundlage ist ISO 22301, der Umfang richtet sich nach Ihrem Unternehmen — ein Produktionsbetrieb mit einer Handvoll kritischer Systeme braucht etwas anderes als ein Finanzdienstleister.",
			"Das NISG 2026 zählt die Aufrechterhaltung des Betriebs ausdrücklich zu den Mindestinhalten der Risikomanagementmaßnahmen, einschließlich Backup-Management, Wiederherstellung nach einem Notfall und Krisenmanagement (§ 32 Abs. 4). Wer das nachweisen muss, braucht mehr als eine Sicherungskopie: einen Plan, eine Reihenfolge und Menschen, die beides kennen.",
			"Ein Notfallplan, der nie geübt wurde, ist eine Vermutung. Deshalb gehören Übungen dazu — vom Planspiel am Tisch, bei dem die Leitung einen Ausfall durchspielt, bis zum technischen Wiederanlauf, bei dem sich zeigt, ob die Sicherung wirklich zurückgespielt werden kann.",
		],
	},
	{
		id: "vorfallmanagement",
		titel: "Vorfallmanagement und Meldepflichten",
		absaetze: [
			"Erkennen, einstufen, eindämmen, melden, nacharbeiten. Wer unter das NISG 2026 fällt, muss jeden erheblichen Cybersicherheitsvorfall melden, und zwar gestaffelt: eine Frühwarnung innerhalb von 24 Stunden nach Kenntnisnahme, eine Meldung mit erster Bewertung innerhalb von 72 Stunden und einen Abschlussbericht spätestens einen Monat danach (§ 34 Abs. 2).",
			"Die schwierigste Entscheidung fällt ganz am Anfang: Ist der Vorfall erheblich? Das Gesetz knüpft das an schwerwiegende Betriebsstörungen, finanzielle Verluste oder erhebliche Schäden bei Dritten (§ 35). Diese Einschätzung muss unter Zeitdruck getroffen werden und später einer Prüfung standhalten — sie gehört deshalb vorab in klare Kriterien übersetzt, nicht erst im Ernstfall diskutiert.",
			"Ich baue den Prozess dafür auf: Kriterien, Zuständigkeiten, Vorlagen, Kommunikationswege, Übungen. Aus der Praxis in einem beaufsichtigten Kreditinstitut kenne ich die Zusammenarbeit mit Branchen-CERTs und die Anforderungen an Berichte, die eine Aufsicht liest.",
		],
	},
	{
		id: "automatisierung",
		titel: "Automatisierung von Kontrollen und Prozessschritten",
		absaetze: [
			"Berechtigungsprüfungen, Risikobewertungen, Schutzbedarfsfeststellungen, Nachweise für Audits: Vieles davon wiederholt sich und lässt sich automatisieren, ohne dass die Nachvollziehbarkeit leidet — im Gegenteil. Ein automatisierter Ablauf dokumentiert sich selbst. Wer wann was freigegeben hat, steht im Protokoll, nicht in der Erinnerung.",
			"Umgesetzt wird mit den Werkzeugen, die Sie schon haben, etwa Microsoft 365 und Power Automate oder Google Workspace und Apps Script, oder mit n8n. Ein Beispiel aus der Praxis: Anlage, Änderung und Entzug von Berechtigungen laufen vollständig automatisiert, jede Vergabe ist lückenlos nachvollziehbar, ohne dass jemand Protokoll führen muss.",
			"Ergebnis ist ein Ablauf, den Fachbereich, Leitung und Prüfer ohne zusätzliche Erklärung verstehen, und ein laufender Aufwand, der dauerhaft sinkt, statt mit jedem Auditzyklus zu wachsen.",
		],
	},
] as const;

export default function SecurityServicesSeite() {
	return (
		<>
			<StrukturierteDaten
				daten={leistung({
					name: "Security Services",
					pfad: "/security-services",
					art: "Externer Informationssicherheitsbeauftragter und Beratung zur Informationssicherheit",
					beschreibung:
						"CISO as a Service, interne Audits und Lieferantenaudits, IKT-Risikomanagement, Business Continuity Management, Vorfallmanagement und Automatisierung von Kontrollen.",
				})}
			/>
			<Leistungsseite
				titel="Security Services"
				einleitung="Alles, was über den Aufbau eines ISMS und die Umsetzung des NISG 2026 hinausgeht — oder genau dort ansetzt, wo ein bestehendes Team Verstärkung braucht."
				stufen={[{ titel: "Security Services", pfad: "/security-services" }]}
			>
				<nav aria-label="Leistungen auf dieser Seite">
					<ul>
						{LEISTUNGEN.map((eintrag) => (
							<li key={eintrag.id}>
								<a href={`#${eintrag.id}`}>{eintrag.titel}</a>
							</li>
						))}
						<li>
							<a href="#dora">DORA-Beratung</a>
						</li>
						<li>
							<a href="#beratungshaeuser">Für Beratungshäuser</a>
						</li>
					</ul>
				</nav>

				{LEISTUNGEN.map((eintrag) => (
					<section key={eintrag.id} aria-labelledby={eintrag.id}>
						<h2 id={eintrag.id}>{eintrag.titel}</h2>
						{eintrag.absaetze.map((absatz) => (
							<p key={absatz.slice(0, 40)} className="mt-4">
								{absatz}
							</p>
						))}
					</section>
				))}

				<section aria-labelledby="dora">
					<h2 id="dora">DORA-Beratung</h2>
					<p className="mt-4">
						Für Finanzunternehmen gilt mit der Verordnung (EU) 2022/2554 über
						die digitale operationale Resilienz im Finanzsektor ein eigener
						Rahmen. In einer österreichischen Landesbank habe ich das
						DORA-Implementierungsprojekt verantwortet und die Lücken zwischen
						NIS2 und DORA analysiert. Diese Erfahrung steht Finanzunternehmen
						und ihren IKT-Dienstleistern für einzelne Fragestellungen zur
						Verfügung — von der Gap-Analyse bis zum IKT-Drittparteienrisiko.
					</p>
				</section>

				<section aria-labelledby="beratungshaeuser">
					<h2 id="beratungshaeuser">Für Beratungshäuser</h2>
					<p className="mt-4">
						Sie brauchen kurzfristig Verstärkung in einem NIS2-, ISO-27001-
						oder DORA-Projekt? Ich arbeite auch als Subauftragnehmer, bis zu
						vier Tage pro Woche, in Wien, Niederösterreich und Umland.
						Einsatzgebiete: Rolle des
						Informationssicherheitsbeauftragten, interne Audits und
						Lieferantenaudits, IKT-Risikomanagement, Business Continuity,
						Automatisierung von Kontrollen.
					</p>
					<p className="mt-4">
						Ich arbeite in Ihren Strukturen: mit Ihren Vorlagen, Ihren
						Werkzeugen und über Ihre Ansprechpartner beim Kunden. Ergebnisse
						dokumentiere ich so, dass Ihr Team sie ohne mich weiterführen kann.
						Eine Grenze gilt auch hier: Als berufener Auditor übernehme ich
						keine Zertifizierungsaudits bei Unternehmen, an deren Beratung ich
						beteiligt war.
					</p>
					<p className="mt-4">
						Ein ausführliches Beraterprofil schicke ich auf Anfrage:{" "}
						<a href={`mailto:${site.email}`} data-umami-event="email">{site.email}</a>.
					</p>
				</section>
			</Leistungsseite>
			<div className="mx-auto max-w-5xl px-5 pb-12">
				<Handlung />
			</div>
		</>
	);
}
