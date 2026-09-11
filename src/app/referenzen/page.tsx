import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Handlung } from "@/components/handlung";
import { Leistungsseite } from "@/components/leistungsseite";

export const metadata: Metadata = {
	title: "Referenzen: Projekte ohne Namen, Belege mit Namen",
	description:
		"Warum hier keine Kundennamen stehen, vier anonymisierte Projektsteckbriefe und die Nachweise, die sich ohne Kundenfreigabe überprüfen lassen.",
	openGraph: { images: [{ url: "/og/leistung.png", width: 1200, height: 630 }] },
};

/*
 * Brief, Abschnitt 7.10. Grundlage ist das Beraterprofil. Beschrieben werden
 * ausschließlich Branche und Größenordnung, keine Namen, Orte, Jahreszahlen
 * oder erkennbare Details. Das Projekt im Kreditinstitut ist als Anstellung
 * gekennzeichnet und bewusst ohne „Landesbank“ und ohne Dauer der Prüfung
 * beschrieben — beides zusammen wäre auf wenige Häuser eingrenzbar.
 * Die Seite ist so gebaut, dass sie nie aktualisiert werden muss.
 */

const STECKBRIEFE = [
	{
		titel: "Externer Informationssicherheitsbeauftragter",
		umfeld: "IT-naher Dienstleister, KMU",
		ausgangslage:
			"Ein Dienstleister, der selbst in Projekten mit NIS2- und DORA-Bezug arbeitet, brauchte die Funktion des Informationssicherheitsbeauftragten, aber keine Vollzeitstelle.",
		auftrag:
			"Laufende Führung der Informationssicherheit als externer Informationssicherheitsbeauftragter.",
		vorgehen:
			"Anforderungsprüfung gegen NIS2, Schutzbedarfsfeststellungen, Begleitung von Change-Projekten, Behandlung von Sicherheitsvorfällen. Wiederkehrende Abläufe sind automatisiert, damit sie ohne händisches Nachhalten laufen.",
		ergebnis:
			"Informationssicherheit als laufender Prozess mit fester Zuständigkeit statt als Thema, das bei jedem Kundenfragebogen neu aufkommt.",
		einordnung:
			"Dienstleister geraten über ihre Kunden unter Druck, noch bevor sie selbst unter ein Gesetz fallen: Wer für ein Unternehmen arbeitet, das NIS2 oder DORA erfüllen muss, bekommt dessen Anforderungen als Vertragsklausel und Fragebogen weitergereicht. Eine feste Zuständigkeit macht aus diesen Anfragen Routine.",
	},
	{
		titel: "ISMS-Grundlagen und Prozessautomatisierung",
		umfeld: "Produzierendes Unternehmen, rund 25 Mitarbeiter",
		ausgangslage:
			"Ein kleines Produktionsunternehmen ohne eigene IT-Sicherheitsfunktion wollte wissen, wo es steht und welche Ausfälle es sich nicht leisten kann.",
		auftrag:
			"Aufbau der Grundlagen eines Informationssicherheits-Managementsystems.",
		vorgehen:
			"Business-Impact-Analyse, Aufbau des Risikomanagements, Dokumentenlenkung und Schutzbedarfsfeststellung. Parallel dazu wurde der Helpdesk-Prozess automatisiert.",
		ergebnis:
			"Das Unternehmen kennt seine kritischen Prozesse und deren tolerierbare Ausfallzeiten, bewertet Risiken nach einer festen Methode und führt seine Dokumente gelenkt.",
		einordnung:
			"Für kleine Unternehmen ist die Reihenfolge entscheidend. Die Business-Impact-Analyse steht am Anfang, weil sie zeigt, wo sich Aufwand lohnt — und wo nicht. Die Automatisierung des Helpdesks war kein Nebenprojekt: Sie entlastet genau die Personen, die sonst die Zeit für Informationssicherheit nicht hätten.",
	},
	{
		titel: "Berechtigungsmanagement",
		umfeld: "Gemeinnützige Organisation",
		ausgangslage:
			"Benutzerkonten und Berechtigungen wurden händisch vergeben. Wer wann worauf Zugriff erhalten hatte, ließ sich im Nachhinein nur mit Mühe feststellen.",
		auftrag:
			"Schutzbedarfsfeststellung und Automatisierung des Benutzer- und Berechtigungsmanagements.",
		vorgehen:
			"Nach der Schutzbedarfsfeststellung wurden Anlage, Änderung und Entzug von Berechtigungen vollständig automatisiert, einschließlich einer Überwachung der Abläufe.",
		ergebnis:
			"Jede Berechtigungsvergabe ist lückenlos nachvollziehbar, ohne dass dafür jemand Protokoll führen muss.",
		einordnung:
			"Berechtigungen sind einer der häufigsten Prüfpunkte in Audits und eine der häufigsten Ursachen für Vorfälle: Konten, die nach einem Austritt weiterbestehen, Rechte, die sich über Jahre ansammeln. Eine händische Lösung skaliert nicht und dokumentiert sich nicht. Die Schutzbedarfsfeststellung vorab sorgt dafür, dass die Automatisierung dort am strengsten ist, wo es darauf ankommt.",
	},
	{
		titel: "Information Security Officer, in Anstellung",
		umfeld: "Beaufsichtigtes Kreditinstitut",
		ausgangslage:
			"Neue regulatorische Anforderungen an die digitale Widerstandsfähigkeit trafen auf ein gewachsenes Risikomanagement und eine anstehende aufsichtsbehördliche Prüfung.",
		auftrag:
			"Rolle des Information Security Officer mit Verantwortung für das Umsetzungsprojekt und das IKT-Risikomanagement.",
		vorgehen:
			"Aufbau und Führung des IKT-Risikomanagements, Business-Impact-Analysen und Notfallplanung, Vorfallmanagement mit Meldeprozess, Lieferantenaudits, Steuerung des Security Operation Center, Berichte an Vorstand und Aufsicht, Begleitung der Prüfung.",
		ergebnis:
			"Ein Risikomanagement und ein Meldeprozess, die den Anforderungen der Aufsicht standhielten — geprüft von der Aufsicht selbst.",
		einordnung:
			"Diese Station war eine Anstellung, kein Beratungsauftrag, und ist hier deshalb auch so bezeichnet. Sie steht auf dieser Seite, weil sie zeigt, was eine aufsichtsbehördliche Prüfung tatsächlich verlangt: nicht die Existenz von Dokumenten, sondern den Nachweis, dass Prozesse wirken. Diese Perspektive fließt in jedes heutige Projekt ein.",
	},
] as const;

export default function ReferenzenSeite() {
	return (
		<>
			<Leistungsseite
				titel="Referenzen"
				einleitung="Auf dieser Seite stehen keine Kundennamen. Das ist keine Lücke, sondern Teil der Leistung."
				stufen={[{ titel: "Referenzen", pfad: "/referenzen" }]}
			>
				<h2>Warum keine Namen</h2>
				<p>
					Wer mich beauftragt, zeigt mir seine Schwachstellen: Lücken in der
					Dokumentation, Risiken, die noch nicht behandelt sind, Vorfälle, die
					nicht öffentlich wurden. Vertraulichkeit darüber ist keine Höflichkeit,
					sondern Voraussetzung dafür, dass diese Offenheit überhaupt entsteht.
					Wer seine Kunden öffentlich aufzählt, würde über Sie genauso reden.
				</p>
				<p>
					Im persönlichen Gespräch nenne ich Namen und Ansprechpartner, soweit
					die jeweiligen Kunden dem zugestimmt haben. Bis dahin beschreibe ich
					Projekte nur nach Branche und Größenordnung.
				</p>

				<h2>Aus der Praxis</h2>
				<p>
					Die Steckbriefe folgen demselben Aufbau: Ausgangslage, Auftrag,
					Vorgehen, Ergebnis. Die Einordnung darunter erklärt, warum der
					jeweilige Schritt zählt. Sie ist allgemeine Fachkenntnis, keine
					Aussage über den jeweiligen Kunden.
				</p>
				<div className="!mt-6 space-y-10">
					{STECKBRIEFE.map((steckbrief) => (
						<section
							key={steckbrief.titel}
							aria-label={steckbrief.titel}
							className="border-t border-linie pt-6"
						>
							<p className="text-sm text-stahl">{steckbrief.umfeld}</p>
							<h3 className="!mt-1">{steckbrief.titel}</h3>
							<dl className="mt-4">
								<dt>Ausgangslage</dt>
								<dd>{steckbrief.ausgangslage}</dd>
								<dt>Auftrag</dt>
								<dd>{steckbrief.auftrag}</dd>
								<dt>Vorgehen</dt>
								<dd>{steckbrief.vorgehen}</dd>
								<dt>Ergebnis</dt>
								<dd>{steckbrief.ergebnis}</dd>
								<dt>Einordnung</dt>
								<dd>{steckbrief.einordnung}</dd>
							</dl>
						</section>
					))}
				</div>

				<h2>Woran Sie mich sonst messen können</h2>
				<p>
					Diese Belege brauchen keine Kundenfreigabe. Sie lassen sich bei den
					ausstellenden Stellen überprüfen:
				</p>
				<ul>
					<li>Berufung durch die CIS für ISO/IEC 27001</li>
					<li>
						Personenzertifizierungen als Information Security Auditor und
						Information Security Manager (CIS, nach EN ISO/IEC 17024)
					</li>
					<li>Dipl.-Ing., Informatik &amp; Security, FH St. Pölten</li>
					<li>
						Beruflicher Werdegang auf{" "}
						<a href={site.linkedin} rel="noopener noreferrer me">
							LinkedIn
						</a>
					</li>
				</ul>
			</Leistungsseite>
			<div className="mx-auto max-w-5xl px-5 pb-12">
				<Handlung text="Namen und Ansprechpartner nenne ich im Gespräch, soweit die Kunden zugestimmt haben. Den Preisrahmen ebenso — nicht nach drei Terminen." />
			</div>
		</>
	);
}
