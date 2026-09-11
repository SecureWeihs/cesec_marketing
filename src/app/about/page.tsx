import type { Metadata } from "next";
import { person } from "@/lib/strukturierte-daten";
import { site } from "@/lib/site";
import { Bild } from "@/components/bild";
import { Brotkrumen } from "@/components/brotkrumen";
import { StrukturierteDaten } from "@/components/strukturierte-daten";

export const metadata: Metadata = {
	title: "Sascha Weihs, Informationssicherheitsbeauftragter",
	description:
		"Werdegang, Zertifizierungen und Arbeitsweise: Informationssicherheitsbeauftragter mit Aufsichtserfahrung aus Bank und OeNB-Prüfung, von der CIS für ISO/IEC 27001 berufen.",
	openGraph: { images: [{ url: "/og/about.png", width: 1200, height: 630 }] },
};

/*
 * Alle Aussagen über den Inhaber stammen aus dem Beraterprofil oder aus dem
 * Projekt-Brief. Freigabepflichtig. Zwei Formulierungen weichen bewusst vom
 * Profil ab und stehen zur Freigabe:
 * - „führender österreichischer IT-Dienstleister“ ist ohne „führender“
 *   übernommen; Superlative sind in der Tonalität ausgeschlossen.
 * - TODO(inhaber): Beginn der Selbstständigkeit. Das Profil nennt als
 *   frühestes eigenes Projekt 02/2025, aber kein Gründungsdatum.
 */

const WERDEGANG = [
	{
		zeitraum: "seit 02/2025",
		rolle: "Berater für Informationssicherheit, Cesec e. U.",
		umfeld:
			"Externer Informationssicherheitsbeauftragter, ISMS-Beratung und Prozessautomatisierung für KMU und gemeinnützige Organisationen, auch als Subdienstleister in NIS2- und DORA-Projekten.",
	},
	{
		zeitraum: "09/2023 – 01/2025",
		rolle: "Information Security Officer",
		umfeld:
			"Österreichische Landesbank, beaufsichtigtes Kreditinstitut. Verantwortung für das DORA-Implementierungsprojekt, Aufbau und Führung des IKT-Risikomanagements, BCM und BIA, IKT-Vorfallmanagement und Meldepflichten, Begleitung aufsichtsbehördlicher Prüfungen, Berichte an Vorstand und Aufsichtsbehörde.",
	},
	{
		zeitraum: "01/2020 – 08/2023",
		rolle: "Information Security Officer und stellvertretender CISO",
		umfeld:
			"Österreichischer IT-Dienstleister mit zertifiziertem ISMS nach ISO/IEC 27001. Interne Audits und Lieferantenaudits, Überarbeitung des Richtlinienwerks, Automatisierung nahezu aller Prozesse im Risikomanagement, Aufbau eines Berechtigungsmanagements.",
	},
	{
		zeitraum: "09/2018 – 12/2018",
		rolle: "Associated Security Consultant",
		umfeld:
			"Spezialisierte Security-Beratung. Richtlinien und Policies, Secure Coding Guidelines.",
	},
] as const;

const NACHWEISE = [
	"Von der CIS für ISO/IEC 27001 berufen",
	"Information Security Auditor (CIS, nach EN ISO/IEC 17024)",
	"Information Security Manager (CIS, nach EN ISO/IEC 17024)",
	"ITIL",
	"Dipl.-Ing., Informatik & Security, FH St. Pölten, Abschluss 07/2021, Vertiefung IT-Management",
] as const;

export default function UeberMichSeite() {
	return (
		<div className="mx-auto max-w-5xl px-5 py-12">
			<StrukturierteDaten daten={person()} />
			<Brotkrumen stufen={[{ titel: "About", pfad: "/about" }]} />

			<div className="grid gap-10 md:grid-cols-[1fr_16rem] md:items-start">
				<div>
					<h1 className="text-3xl sm:text-4xl">Dipl.-Ing. Sascha Weihs</h1>
					<p className="mt-5 max-w-satz text-lg text-stahl">
						Informationssicherheitsbeauftragter mit Schwerpunkt auf dem Aufbau
						und Betrieb von Managementsystemen im regulierten Umfeld.
					</p>
				</div>
				<Bild
					name="portraet-about"
					breite={560}
					hoehe={840}
					vorrang
					alt="Porträt von Sascha Weihs im dunklen Sakko und weißen Hemd vor grauem Hintergrund, die Arme verschränkt."
					klasse="h-auto w-full max-w-64 border border-linie"
				/>
			</div>

			<div className="fliesstext mt-12">
				<p>
					Zuletzt war ich Informationssicherheitsbeauftragter einer
					österreichischen Landesbank. Davor mehrjährige Auditpraxis in einem
					nach ISO/IEC 27001 zertifizierten IT-Dienstleister. Von der CIS für
					ISO/IEC 27001 berufen, kenne ich die Anforderungen sowohl aus Sicht
					des Unternehmens als auch aus Sicht der Zertifizierungsstelle.
				</p>

				<h2>Werdegang</h2>
				<ol className="!list-none !pl-0">
					{WERDEGANG.map((station) => (
						<li
							key={station.zeitraum}
							className="border-t border-linie py-4 first:border-t-0 first:pt-0"
						>
							<p className="text-sm text-stahl">{station.zeitraum}</p>
							<p className="mt-1 font-medium">{station.rolle}</p>
							<p className="mt-1">{station.umfeld}</p>
						</li>
					))}
				</ol>
				<p className="text-stahl">Weitere Stationen und Referenzen auf Anfrage.</p>

				<h2>Aufsichtserfahrung</h2>
				<p>
					In der Landesbank lag die Verantwortung für das
					DORA-Implementierungsprojekt bei mir, ebenso das IKT-Risikomanagement
					und die Begleitung einer sechs Monate laufenden Prüfung der
					Österreichischen Nationalbank. Daraus stammt, was ich heute in
					NIS2- und ISO-27001-Projekte mitnehme: wie eine Aufsicht prüft,
					welche Nachweise sie verlangt und woran Dokumentation scheitert,
					die im Alltag ausreichend wirkte.
				</p>

				<h2>Zertifizierungen und Ausbildung</h2>
				<ul>
					{NACHWEISE.map((nachweis) => (
						<li key={nachweis}>{nachweis}</li>
					))}
				</ul>

				<h2>Arbeitsweise</h2>
				<p>
					Das Unterscheidungsmerkmal in der Arbeitsweise sind die Bereitschaft
					zu Innovation, effizientes Prozessmanagement und KI-Know-how.
					Kontrollen und wiederkehrende Prozessschritte werden automatisiert,
					Abläufe so gestaltet, dass sie für Fachbereiche, Leitungsorgane und
					Prüfer ohne zusätzliche Erklärung nachvollziehbar bleiben. Der
					laufende Aufwand beim Kunden sinkt dadurch dauerhaft, statt mit jedem
					Auditzyklus zu wachsen.
				</p>
				<p>
					Cesec ist ein Ein-Personen-Unternehmen. Wer mich beauftragt, bekommt
					mich — eine Person, die haftet und auch arbeitet.
				</p>

				<h2>Unabhängigkeit</h2>
				<p>
					Als berufener Auditor unterliege ich der Unabhängigkeitspflicht nach
					ISO/IEC 17021: Unternehmen, die ich berate, kann ich nicht selbst
					zertifizieren. Provisionen von Herstellern oder Softwareanbietern
					nehme ich nicht an. Eine Empfehlung für ein Werkzeug hat deshalb
					keinen anderen Grund als die Sache.
				</p>

				<h2>Verfügbarkeit</h2>
				<dl>
					<dt>Kapazität</dt>
					<dd>bis zu vier Tage pro Woche</dd>
					<dt>Einsatzraum</dt>
					<dd>Wien, Niederösterreich und Umland, überwiegend remote möglich</dd>
					<dt>Sprachen</dt>
					<dd>Deutsch (Muttersprache), Englisch (C1)</dd>
				</dl>
				<p>
					Die Kapazitätsgrenze ist Absicht: Mehr Mandate gleichzeitig würden
					bedeuten, dass jemand anderes die Arbeit macht.
				</p>

				<h2>Kontakt</h2>
				<p>
					Telefon <a href={`tel:${site.telefon.e164}`}>{site.telefon.anzeige}</a>,
					E-Mail <a href={`mailto:${site.email}`}>{site.email}</a>, oder über{" "}
					<a href={site.linkedin} rel="noopener noreferrer me">
						LinkedIn
					</a>
					.
				</p>
			</div>
		</div>
	);
}
