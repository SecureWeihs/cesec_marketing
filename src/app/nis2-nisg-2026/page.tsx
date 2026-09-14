import type { Metadata } from "next";
import { istVerfuegbar } from "@/lib/navigation";
import { anlagenQuelle, anlagenTitel, sektoren } from "@/lib/sektoren";
import { leistung } from "@/lib/strukturierte-daten";
import { Fragen } from "@/components/fragen";
import { Fristenliste } from "@/components/fristenliste";
import { Handlung } from "@/components/handlung";
import { Leistungsseite } from "@/components/leistungsseite";
import { StrukturierteDaten } from "@/components/strukturierte-daten";
import { Verweis } from "@/components/verweis";
import Link from "next/link";

export const metadata: Metadata = {
	title: "NIS2 Beratung Österreich: NISG 2026 umsetzen",
	description:
		"Wer unter das NISG 2026 fällt, welche Pflichten und Fristen gelten und wie die Umsetzung abläuft — jede Aussage mit Fundstelle im Gesetzestext belegt.",
	alternates: { canonical: "/nis2-nisg-2026" },
	openGraph: { images: [{ url: "/og/leistung.png", width: 1200, height: 630 }] },
};

/*
 * Jede Rechtsaussage ist am Gesetzestext geprüft: NISG 2026, BGBl. I
 * Nr. 94/2025, kundgemacht am 23.12.2025, authentisches Bundesgesetzblatt
 * und konsolidierte Fassung vom 01.10.2026. Fundstellen stehen im Text.
 *
 * Bewusst nicht auf dieser Seite:
 * - Eurobeträge. Die Schwellen für Umsatz und Bilanzsumme (§ 25) und die
 *   Strafrahmen (§ 45) enthalten Beträge; die Website nennt keine. Die
 *   Schwellen stehen im Selbstcheck, die Strafrahmen im Gesetz.
 * Die Zuordnung der Sektoren zu den Anlagen ist an den amtlichen PDFs der
 * Anlagen geprüft (src/lib/sektoren.ts).
 * - DORA als eigenes Thema (Brief, Abschnitt 5).
 */

const MASSNAHMEN = [
	"Konzepte für Risikoanalyse und Sicherheit der Informationssysteme",
	"Bewältigung von Cybersicherheitsvorfällen",
	"Aufrechterhaltung des Betriebs: Backup-Management, Wiederherstellung nach einem Notfall, Krisenmanagement",
	"Sicherheit der Lieferkette, einschließlich der Beziehungen zu unmittelbaren Anbietern und Dienstleistern",
	"Sicherheit bei Erwerb, Entwicklung und Wartung von Systemen, einschließlich des Umgangs mit Schwachstellen",
	"Verfahren, mit denen die Wirksamkeit der Maßnahmen bewertet wird",
	"Grundlegende Cyberhygiene und Schulungen",
	"Kryptografie und gegebenenfalls Verschlüsselung",
	"Sicherheit des Personals, Zugriffskontrolle und Management der Anlagen",
	"Multi-Faktor-Authentifizierung oder kontinuierliche Authentifizierung, gesicherte Kommunikation und gegebenenfalls gesicherte Notfallkommunikation",
] as const;

const FRAGEN = [
	{
		frage: "Unser Unternehmen hat weniger als 50 Mitarbeiter. Sind wir damit raus?",
		antwort:
			"Nicht unbedingt. Die Größe richtet sich nicht nur nach der Mitarbeiterzahl, sondern auch nach Jahresumsatz und Jahresbilanzsumme (§ 25). Einige Arten von Einrichtungen fallen unabhängig von ihrer Größe unter das Gesetz, etwa DNS-Diensteanbieter oder Vertrauensdiensteanbieter (§ 24), und die Behörde kann Einrichtungen per Bescheid einstufen (§ 26). Und wer selbst nicht erfasst ist, bekommt die Anforderungen oft als Lieferant über seine Kunden weitergereicht.",
	},
	{
		frage: "Wir gehören zu einem Konzern. Zählen die Mitarbeiter der Muttergesellschaft mit?",
		antwort:
			"Grundsätzlich werden Partner- und verbundene Unternehmen nach der Empfehlung 2003/361/EG mitgerechnet. Das NISG 2026 macht eine Ausnahme: Ist Ihr Unternehmen bei den Netz- und Informationssystemen organisatorisch, technisch und operativ unabhängig vom Konzern, werden die Daten nicht hinzugerechnet (§ 25 Abs. 4). Ob das zutrifft, ist eine Einzelfallfrage.",
	},
	{
		frage: "Was ist der Unterschied zwischen wesentlichen und wichtigen Einrichtungen?",
		antwort:
			"Beide müssen sich registrieren, Risikomanagementmaßnahmen umsetzen und erhebliche Vorfälle melden. Der Unterschied liegt vor allem in der Aufsicht. Bei wesentlichen Einrichtungen kann die Behörde von sich aus kontrollieren, vor Ort oder aus der Ferne, Sicherheitsscans durchführen und Ad-hoc-Prüfungen anordnen (§ 38 Abs. 1). Bei wichtigen Einrichtungen wird sie vor allem tätig, wenn Nachweise oder begründete Hinweise auf Verstöße vorliegen (§ 38 Abs. 2). Dazu kommt die kürzere Nachweisfrist für wesentliche Einrichtungen (§ 33 Abs. 2).",
	},
	{
		frage: "Genügt eine Zertifizierung nach ISO 27001?",
		antwort:
			"Sie hilft erheblich, genügt aber nicht allein. Das Gesetz erlaubt, die operative und organisatorische Umsetzung der Maßnahmen auch durch einschlägige gültige Zertifikate nachzuweisen (§ 33 Abs. 2). Registrierung, Meldepflichten und Selbstdeklaration bleiben eigene Pflichten, und der Geltungsbereich des Zertifikats muss zu dem passen, was das Gesetz erfasst.",
	},
	{
		frage: "Haftet die Geschäftsführung persönlich?",
		antwort:
			"Das Gesetz verpflichtet die Leitungsorgane, die Umsetzung der Risikomanagementmaßnahmen sicherzustellen und zu beaufsichtigen, und schreibt ihnen Cybersicherheitsschulungen vor (§ 31). Wer die vorgesehenen Schulungen nicht anbietet, begeht eine Verwaltungsübertretung (§ 45 Abs. 1). Wie weit eine persönliche Haftung darüber hinaus reicht, hängt vom Gesellschaftsrecht und vom Einzelfall ab — das ist eine Frage für Ihre Rechtsberatung.",
	},
	{
		frage: "Wir sind Lieferant eines betroffenen Unternehmens. Was kommt auf uns zu?",
		antwort:
			"Das Gesetz verpflichtet Ihren Kunden, die Sicherheit seiner Lieferkette zu berücksichtigen (§ 32 Abs. 4). In der Praxis erreicht Sie das als Fragebogen, als Vertragsklausel oder als Auditanfrage. Wichtig ist, die Fragen ehrlich zu beantworten und nichts zuzusagen, was Sie nicht nachweisen können.",
	},
] as const;

export default function Nis2Seite() {
	const selbstcheck = istVerfuegbar("/nis2-nisg-2026/betroffenheit-pruefen");

	return (
		<>
			<StrukturierteDaten
				daten={leistung({
					name: "NIS2- und NISG-2026-Beratung",
					pfad: "/nis2-nisg-2026",
					art: "Beratung zur Umsetzung des Netz- und Informationssystemsicherheitsgesetzes 2026",
					beschreibung:
						"Betroffenheitsanalyse, Registrierung, Gap-Analyse gegen die Risikomanagementmaßnahmen, Umsetzung, Meldeprozess und Vorbereitung auf Selbstdeklaration und Prüfung.",
				})}
			/>
			<Leistungsseite
				titel="NIS2 und NISG 2026: klären, ob Sie betroffen sind, und die Pflichten prüfbar umsetzen"
				einleitung="Das Netz- und Informationssystemsicherheitsgesetz 2026 setzt die europäische NIS2-Richtlinie in Österreich um. Es erfasst deutlich mehr Unternehmen als das bisherige NISG und legt die Verantwortung ausdrücklich zur Geschäftsführung."
				stufen={[{ titel: "NIS2 & NISG 2026", pfad: "/nis2-nisg-2026" }]}
			>
				{selbstcheck && (
					<p className="border-l-2 border-signal pl-4">
						<Link href="/nis2-nisg-2026/betroffenheit-pruefen">
							Betroffenheit in fünf Fragen prüfen
						</Link>{" "}
						— läuft vollständig in Ihrem Browser, ohne Anmeldung.
					</p>
				)}

				<h2>Was das NISG 2026 verlangt</h2>
				<p>
					Das Gesetz legt Maßnahmen fest, mit denen ein hohes
					Cybersicherheitsniveau erreicht werden soll, insbesondere bei
					wesentlichen und wichtigen Einrichtungen in 18 Sektoren (§ 2). Es ist
					im Bundesgesetzblatt als BGBl. I Nr. 94/2025 kundgemacht.
					Zuständig ist die Cybersicherheitsbehörde, das Bundesamt für
					Cybersicherheit.
				</p>
				<p>
					Im Kern stehen vier Pflichten: sich registrieren, angemessene
					Risikomanagementmaßnahmen umsetzen, erhebliche Vorfälle melden und
					die Wirksamkeit der Maßnahmen nachweisen. Dazu kommt eine Pflicht, die
					sich nicht an das Unternehmen, sondern an seine Leitung richtet.
				</p>

				<h2>Wer betroffen ist</h2>
				<p>
					Das Gesetz nennt 18 Sektoren (§ 2) und ordnet sie zwei Anlagen zu.
					Die Anlage entscheidet mit darüber, ob eine Einrichtung als
					wesentlich oder als wichtig gilt.
				</p>
				{([1, 2] as const).map((anlage) => (
					<div key={anlage}>
						<h3>
							<a href={anlagenQuelle[anlage]} rel="noopener noreferrer">
								{anlagenTitel[anlage]}
							</a>
						</h3>
						<ul className="sm:columns-2 sm:gap-8">
							{sektoren
								.filter((sektor) => sektor.anlage === anlage)
								.map((sektor) => (
									<li key={sektor.id} className="break-inside-avoid">
										{sektor.name}
									</li>
								))}
						</ul>
					</div>
				))}
				<p>
					Welche Arten von Einrichtungen innerhalb dieser Sektoren gemeint
					sind, legen die Anlagen im Detail fest, oft mit Verweis auf
					Fachgesetze — nicht jedes Unternehmen eines Sektors ist automatisch
					erfasst. Entscheidend sind drei Fragen:
				</p>
				<h3>1. Gehört Ihre Tätigkeit zu einer der Arten in den Anlagen?</h3>
				<p>
					Es kommt auf die tatsächliche Tätigkeit an, nicht auf die
					Branchenbezeichnung im Firmenbuch. Ein Handelsunternehmen mit
					eigener Lebensmittelverarbeitung kann erfasst sein, ein
					IT-Dienstleister als Anbieter verwalteter Dienste ebenso.
				</p>
				<h3>2. Wie groß ist Ihr Unternehmen?</h3>
				<p>
					Als mittleres Unternehmen gilt, wer zumindest 50 Mitarbeiter
					beschäftigt oder sowohl beim Jahresumsatz als auch bei der
					Jahresbilanzsumme bestimmte Schwellen überschreitet; als großes
					Unternehmen, wer zumindest 250 Mitarbeiter beschäftigt oder die
					entsprechend höheren Schwellen überschreitet (§ 25 Abs. 2 und 3).
					Grundlage ist die KMU-Definition der Empfehlung 2003/361/EG.
				</p>
				<p>
					Einrichtungen der Anlage 1, die ein großes Unternehmen betreiben,
					gelten als <strong>wesentliche Einrichtungen</strong>. Einrichtungen
					der Anlagen 1 und 2, die ein mittleres oder großes Unternehmen
					betreiben und nicht schon wesentlich sind, gelten als{" "}
					<strong>wichtige Einrichtungen</strong> (§ 24).
				</p>
				<h3>3. Gilt eine Sonderregel?</h3>
				<p>
					Manche Einrichtungen sind unabhängig von ihrer Größe erfasst, etwa
					qualifizierte Vertrauensdiensteanbieter, DNS-Diensteanbieter,
					TLD-Namenregister und Einrichtungen der öffentlichen Verwaltung des
					Bundes (§ 24 Abs. 1). Die Behörde kann außerdem kleinere
					Einrichtungen per Bescheid einstufen, etwa wenn sie der einzige
					Anbieter eines unerlässlichen Dienstes sind (§ 26). Erfasst sind
					grundsätzlich Einrichtungen, die in Österreich niedergelassen sind;
					für Kommunikations-, Cloud- und Rechenzentrumsanbieter und einige
					andere digitale Dienste gelten eigene Regeln (§ 28).
				</p>

				<h3>Und die Lieferkette?</h3>
				<p>
					Wer selbst nicht erfasst ist, ist oft trotzdem betroffen. Das
					Gesetz verpflichtet die erfassten Einrichtungen, die Sicherheit
					ihrer Lieferkette zu berücksichtigen — einschließlich der
					Cybersicherheitspraxis ihrer unmittelbaren Anbieter (§ 32 Abs. 4
					lit. d). Die Anforderungen landen deshalb als Fragebogen,
					Vertragsklausel oder Auditanfrage bei Lieferanten, die das Gesetz
					selbst nie erwähnt.{" "}
					<Verweis pfad="/nis2-nisg-2026/lieferkette-und-fragebogen">
						Wie Sie einen Lieferantenfragebogen beantworten, ohne zu übertreiben
					</Verweis>
					.
				</p>

				<h2>Fristen</h2>
				<Fristenliste />
				<p>
					Mehr dazu, was die Registrierung verlangt und wie die
					Selbstdeklaration aussieht:{" "}
					<Verweis pfad="/nis2-nisg-2026/fristen-und-registrierung">
						Fristen und Registrierung nach dem NISG 2026
					</Verweis>
					.
				</p>

				<h2>Welche Pflichten daraus folgen</h2>
				<h3>Registrierung</h3>
				<p>
					Erfasste Einrichtungen müssen sich bei der Cybersicherheitsbehörde
					elektronisch registrieren und dabei unter anderem Sektor und Art der
					Einrichtung, Kontaktdaten, Niederlassungen und die Mitgliedstaaten
					angeben, in denen sie tätig sind (§ 29 Abs. 2). Auch die Angaben,
					nach denen sich die Einstufung als wesentlich oder wichtig richtet,
					gehören dazu. Die Registrierung ist damit auch eine Selbsteinstufung —
					und die Behörde prüft sie.
				</p>
				<h3>Verantwortung der Leitung</h3>
				<p>
					Die Leitungsorgane müssen die Einhaltung der
					Risikomanagementmaßnahmen sicherstellen und beaufsichtigen und selbst
					an Cybersicherheitsschulungen teilnehmen; den Mitarbeitern sind
					regelmäßig Schulungen anzubieten (§ 31). Das lässt sich nicht
					vollständig delegieren.{" "}
					<Verweis pfad="/nis2-nisg-2026/haftung-der-geschaeftsfuehrung">
						Was das für die Geschäftsführung konkret bedeutet
					</Verweis>
					.
				</p>
				<h3>Risikomanagementmaßnahmen</h3>
				<p>
					Die Maßnahmen müssen geeignet und verhältnismäßig sein, dem Stand
					der Technik und dem Risiko entsprechen und auf einem
					gefahrenübergreifenden Ansatz beruhen (§ 32 Abs. 1 bis 4). Das Gesetz
					nennt zehn Mindestinhalte:
				</p>
				<ol>
					{MASSNAHMEN.map((massnahme) => (
						<li key={massnahme}>{massnahme}</li>
					))}
				</ol>
				<h3>Nachweis</h3>
				<p>
					Innerhalb von zwölf Monaten nach Eintritt der Registrierungspflicht
					ist der Behörde eine Selbstdeklaration zu den umgesetzten Maßnahmen
					zu übermitteln (§ 33 Abs. 1). Auf Aufforderung der Behörde ist die
					Umsetzung außerdem durch eine Prüfung einer unabhängigen Stelle zu
					belegen — frühestens zwei Jahre nach Inkrafttreten, dann innerhalb
					von zwei Jahren ab der Aufforderung. Wesentliche Einrichtungen müssen
					die operative und organisatorische Umsetzung abweichend davon schon
					innerhalb von zwei Monaten nach Aufforderung nachweisen. Dieser Teil
					des Nachweises ist auch durch einschlägige gültige Zertifikate
					möglich (§ 33 Abs. 2).
				</p>
				<h3>Meldepflichten</h3>
				<p>
					Erhebliche Cybersicherheitsvorfälle sind dem zuständigen CSIRT zu
					melden: eine Frühwarnung innerhalb von 24 Stunden nach Kenntnisnahme,
					eine Meldung mit erster Bewertung innerhalb von 72 Stunden und ein
					Abschlussbericht spätestens einen Monat danach (§ 34). Erheblich ist
					ein Vorfall, der schwerwiegende Betriebsstörungen oder finanzielle
					Verluste verursacht oder verursachen kann oder andere erheblich
					schädigt (§ 35).
				</p>
				<h3>Strafen</h3>
				<p>
					Verstöße sind Verwaltungsübertretungen, die von den
					Bezirksverwaltungsbehörden geahndet werden (§ 44). Strafbar sind
					unter anderem fehlende Schulungen für Leitungsorgane und
					Mitarbeiter, nicht umgesetzte Risikomanagementmaßnahmen und
					versäumte Meldungen (§ 45 Abs. 1). Geldstrafen können auch gegen das
					Unternehmen selbst verhängt werden (§ 44 Abs. 3).
				</p>
				<p>
					Für Unternehmen, die aufgrund sektorspezifischen Unionsrechts
					gleichwertige Pflichten erfüllen — etwa im Finanzsektor —, gelten die
					Risikomanagement- und Meldepflichten des NISG 2026 insoweit nicht
					(§ 27).
				</p>

				<h2>Wie eine Umsetzung abläuft</h2>
				<ol>
					<li>
						<strong>Betroffenheit klären.</strong> Tätigkeit, Größe,
						Sonderregeln, Konzernzugehörigkeit. Ergebnis ist eine begründete
						Einstufung, die auch der Behörde gegenüber hält.
					</li>
					<li>
						<strong>Registrieren.</strong> Mit den Angaben aus Schritt 1,
						fristgerecht.
					</li>
					<li>
						<strong>Lücken bestimmen.</strong> Gap-Analyse gegen die zehn
						Mindestinhalte, gewichtet nach Risiko.
					</li>
					<li>
						<strong>Umsetzen.</strong> Maßnahmenplan mit Zuständigkeiten und
						Terminen; zuerst das, was bei einem Vorfall sofort zählt: Meldeweg,
						Backup, Zugriffe.
					</li>
					<li>
						<strong>Leitung schulen.</strong> Die Pflicht aus § 31 ist einfach
						zu erfüllen und teuer zu versäumen.
					</li>
					<li>
						<strong>Nachweisen.</strong> Selbstdeklaration vorbereiten und
						Unterlagen so führen, dass eine Prüfung durch eine unabhängige
						Stelle jederzeit möglich ist.
					</li>
				</ol>

				<h2>Was ich dabei übernehme</h2>
				<p>
					Die Betroffenheitsanalyse mit schriftlicher Begründung, die
					Vorbereitung der Registrierung, die Gap-Analyse, den Maßnahmenplan
					und auf Wunsch die laufende Rolle des externen
					Informationssicherheitsbeauftragten, der die Umsetzung steuert und
					der Geschäftsführung berichtet. Dazu den Meldeprozess mit Kriterien
					für die Erheblichkeit, die Schulung der Leitungsorgane und die
					Vorbereitung auf Selbstdeklaration und Prüfung.
				</p>
				<p>
					Aus einer sechs Monate laufenden Prüfung der Österreichischen
					Nationalbank weiß ich, woran Prüfungen tatsächlich hängen: selten an
					fehlenden Richtlinien, meistens an fehlenden Nachweisen, dass sie
					gelebt werden.
				</p>

				<h2>Wann ich nicht der Richtige bin</h2>
				<ul>
					<li>
						<strong>Wenn Sie einen Rund-um-die-Uhr-Betrieb brauchen.</strong>{" "}
						Security Operations, Überwachung und Bereitschaft übernehmen
						spezialisierte Anbieter. Bei deren Auswahl und Steuerung helfe ich.
					</li>
					<li>
						<strong>Wenn es um Rechtsauslegung mit Haftungsfolgen geht.</strong>{" "}
						Ich lese das Gesetz genau und zitiere es, aber ich bin kein
						Rechtsanwalt. Bei strittigen Einstufungen gehört eine
						Rechtsberatung dazu.
					</li>
					<li>
						<strong>Wenn ein Team gleichzeitig an zehn Standorten gebraucht wird.</strong>{" "}
						Cesec ist ein Ein-Personen-Unternehmen mit bis zu vier Tagen pro
						Woche. Für sehr große Programme bin ich als Teil eines Teams
						geeignet, nicht als dessen Ersatz.
					</li>
				</ul>

				<Fragen fragen={FRAGEN} />
			</Leistungsseite>
			<div className="mx-auto max-w-5xl px-5 pb-12">
				<Handlung />
			</div>
		</>
	);
}
