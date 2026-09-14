import type { Metadata } from "next";
import { leistung } from "@/lib/strukturierte-daten";
import { Fragen } from "@/components/fragen";
import { Handlung } from "@/components/handlung";
import { Leistungsseite } from "@/components/leistungsseite";
import { StrukturierteDaten } from "@/components/strukturierte-daten";
import { Verweis } from "@/components/verweis";

export const metadata: Metadata = {
	title: "ISO 27001 Beratung: ISMS-Aufbau bis zum Zertifikat",
	description:
		"Reifegradanalyse, Dokumentation, interne Audits und Voraudit bis zur Begleitung durch Stufe 1 und Stufe 2 — ISO-27001-Beratung von einem berufenen Auditor.",
	alternates: { canonical: "/iso-27001" },
	openGraph: { images: [{ url: "/og/leistung.png", width: 1200, height: 630 }] },
};

/*
 * Quellen:
 * - Zertifizierungszyklus (Stufe 1, Stufe 2, drei Jahre, jährliche
 *   Überwachung, Rezertifizierung): TÜV Rheinland, Seite zur
 *   ISO/IEC-27001-Zertifizierung, abgerufen 11.09.2026.
 * - Unabhängigkeit nach ISO/IEC 17021: Projekt-Brief, Abschnitt 7.4.
 * - Das NISG 2026 nennt ISO/IEC 27001 nicht (Volltextsuche im BGBl. I
 *   Nr. 94/2025). § 33 Abs. 2 lässt den Nachweis der operativen und
 *   organisatorischen Umsetzung „auch durch einschlägige gültige Zertifikate“ zu.
 * Normtexte werden nicht zitiert; Anforderungen stehen in eigenen Worten.
 */

const FRAGEN = [
	{
		frage: "Können Sie unser Unternehmen auch zertifizieren?",
		antwort:
			"Nein. Als berufener Auditor unterliege ich der Unabhängigkeitspflicht nach ISO/IEC 17021: Unternehmen, die ich berate, kann ich nicht selbst zertifizieren. Das Zertifikat stellt eine akkreditierte Zertifizierungsstelle aus, die Sie frei wählen.",
	},
	{
		frage: "Verlangt das NISG 2026 eine Zertifizierung nach ISO 27001?",
		antwort:
			"Das Gesetz schreibt keine bestimmte Norm vor und erwähnt ISO/IEC 27001 nicht. Es lässt aber ausdrücklich zu, dass die operative und organisatorische Umsetzung der Risikomanagementmaßnahmen auch durch einschlägige gültige Zertifikate nachgewiesen wird (§ 33 Abs. 2 NISG 2026). Registrierung und Meldepflichten ersetzt ein Zertifikat nicht.",
	},
	{
		frage: "Wie lange dauert es bis zum Zertifikat?",
		antwort:
			"Das hängt davon ab, was schon vorhanden ist: gelebte Prozesse, Dokumentation, Zuständigkeiten. Eine belastbare Aussage ist nach der Reifegradanalyse möglich, und die steht am Anfang jedes Projekts.",
	},
	{
		frage: "Was ist ein Voraudit, und brauchen wir eines?",
		antwort:
			"Ein Voraudit ist eine Probe unter realistischen Bedingungen: dieselben Fragen, dieselbe Stichprobentiefe wie im Zertifizierungsaudit, aber ohne Folgen. Es lohnt sich immer dann, wenn ein Unternehmen zum ersten Mal zertifiziert wird oder das ISMS seit der letzten Prüfung stark verändert hat.",
	},
] as const;

export default function Iso27001Seite() {
	return (
		<>
			<StrukturierteDaten
				daten={leistung({
					name: "ISO-27001-Beratung",
					pfad: "/iso-27001",
					art: "Beratung zum Aufbau eines Informationssicherheits-Managementsystems nach ISO/IEC 27001",
					beschreibung:
						"Reifegradanalyse, Aufbau der Dokumentation, interne Audits, Voraudit und Begleitung durch Stufe-1- und Stufe-2-Audit.",
				})}
			/>
			<Leistungsseite
				titel="ISO 27001: vom ersten Überblick bis zum Zertifikat"
				einleitung="Ein Informationssicherheits-Managementsystem, das im Alltag trägt und in der Prüfung besteht. Aufgebaut von jemandem, der die Norm aus beiden Richtungen kennt: aus Sicht des Unternehmens und aus Sicht der Zertifizierungsstelle."
				stufen={[{ titel: "ISO 27001", pfad: "/iso-27001" }]}
			>
				<h2>Worum es bei ISO 27001 geht</h2>
				<p>
					ISO/IEC 27001 beschreibt, wie ein Unternehmen seine
					Informationssicherheit steuert: Es legt fest, was geschützt werden
					soll, bewertet die Risiken, entscheidet über Maßnahmen, verteilt
					Zuständigkeiten und überprüft regelmäßig, ob das alles wirkt. Die
					Norm verlangt keine bestimmte Technik. Sie verlangt, dass
					Entscheidungen begründet, dokumentiert und nachvollziehbar sind — und
					dass die Leitung sie trägt.
				</p>
				<p>
					Deshalb scheitern Zertifizierungen selten an fehlender Technik und
					häufig an Dokumenten, die niemand lebt: Richtlinien, die im Intranet
					liegen, aber von keinem Prozess berührt werden; Risikoanalysen, die
					einmal erstellt und nie wieder angesehen wurden. Ein Auditor erkennt
					das an der ersten Stichprobe.
				</p>

				<h2>Der Geltungsbereich entscheidet über alles Weitere</h2>
				<p>
					Die erste Entscheidung in jedem ISMS-Projekt ist die folgenreichste:
					Welche Standorte, Prozesse, Systeme und Dienste gehören dazu? Ein zu
					weit gefasster Geltungsbereich macht das Projekt schwerfällig und
					das Audit teuer an Zeit. Ein zu eng gefasster erzeugt ein Zertifikat,
					das die Frage Ihrer Kunden nicht beantwortet — etwa weil genau der
					Dienst fehlt, den sie bei Ihnen einkaufen.
				</p>
				<p>
					Der Geltungsbereich richtet sich deshalb danach, wofür das Zertifikat
					gebraucht wird: für eine Ausschreibung, für einen Großkunden, als
					Nachweis gegenüber einer Aufsicht oder als Rahmen für das eigene
					Risikomanagement. Diese Frage kläre ich vor jedem anderen Schritt.
				</p>

				<h2>Was ich übernehme</h2>
				<h3>Reifegradanalyse</h3>
				<p>
					Am Anfang steht eine Bestandsaufnahme: Was ist schon da, was fehlt,
					was ist nur auf dem Papier vorhanden. Ergebnis ist eine Liste der
					Lücken mit Einschätzung, welche davon ein Auditor beanstanden würde,
					und ein Zeitplan, der zu Ihrem Betrieb passt.
				</p>
				<h3>Aufbau der Dokumentation</h3>
				<p>
					Geltungsbereich, Risikobeurteilung, Erklärung zur Anwendbarkeit,
					Richtlinien und die Nachweise, die die Norm erwartet. So knapp wie
					möglich, so ausführlich wie nötig. Wiederkehrende Nachweise —
					Berechtigungsprüfungen, Risikobewertungen, Schutzbedarfsfeststellungen
					— werden dort automatisiert, wo es sich lohnt, damit der Aufwand nicht
					mit jedem Auditzyklus wächst.
				</p>
				<h3>Interne Audits</h3>
				<p>
					Die Norm verlangt interne Audits. Ich führe sie durch oder baue das
					Auditprogramm so auf, dass Ihr Team es selbst tragen kann. Die
					Feststellungen sind so formuliert, wie ein externer Auditor sie
					formulieren würde: mit Bezug, Befund und Nachweis.
				</p>
				<h3>Voraudit und Begleitung der Zertifizierung</h3>
				<p>
					Vor dem Zertifizierungsaudit eine Probe unter realistischen
					Bedingungen, danach die Begleitung durch beide Stufen: Vorbereitung
					der Gesprächspartner, Anwesenheit im Audit, Bearbeitung etwaiger
					Abweichungen.
				</p>

				<h2>Was es auf Ihrer Seite braucht</h2>
				<p>
					Ein ISMS lässt sich nicht von außen einbauen. Drei Dinge muss das
					Unternehmen selbst beitragen, und an ihnen hängt der Erfolg mehr als
					an jeder Vorlage:
				</p>
				<ul>
					<li>
						<strong>Eine Leitung, die entscheidet.</strong> Risiken
						akzeptieren, Mittel freigeben, Ziele festlegen — das kann kein
						Berater abnehmen, und der Auditor fragt danach.
					</li>
					<li>
						<strong>Fachbereiche, die mitarbeiten.</strong> Die
						Prozessverantwortlichen wissen, welche Informationen wichtig sind
						und wo es in der Praxis hakt. Ohne sie entsteht Dokumentation, die
						am Betrieb vorbeigeht.
					</li>
					<li>
						<strong>Eine Person, die intern zuständig ist.</strong> Auch wenn
						ich die Rolle des Informationssicherheitsbeauftragten übernehme,
						braucht es im Haus jemanden, der Termine hält und Entscheidungen
						einholt.
					</li>
				</ul>

				<h2>Wie die Zertifizierung abläuft</h2>
				<p>
					Die Erstzertifizierung besteht aus zwei Stufen. In{" "}
					<strong>Stufe 1</strong> prüft die Zertifizierungsstelle die
					Dokumentation und beurteilt, ob das Unternehmen bereit ist. In{" "}
					<strong>Stufe 2</strong> prüft sie, ob das ISMS wirksam ist und der
					Norm entspricht — mit Interviews und Stichproben im laufenden
					Betrieb.
				</p>
				<p>
					Das Zertifikat gilt drei Jahre. In den beiden Jahren dazwischen
					findet jeweils ein Überwachungsaudit statt, danach folgt die
					Rezertifizierung. Ein ISMS ist also kein Projekt mit Enddatum,
					sondern ein Betrieb.
				</p>
				<p>
					Ausführlich:{" "}
					<Verweis pfad="/iso-27001/ablauf-der-zertifizierung">
						Ablauf der ISO-27001-Zertifizierung Schritt für Schritt
					</Verweis>{" "}
					und{" "}
					<Verweis pfad="/iso-27001/interne-audits">
						was interne Audits leisten müssen
					</Verweis>
					.
				</p>

				<h2>Unabhängigkeit</h2>
				<p>
					Ich bin von der CIS für ISO/IEC 27001 berufen. Daraus folgt eine
					Grenze, die Sie kennen sollten: Nach ISO/IEC 17021 gilt eine
					Unabhängigkeitspflicht, beratene Kunden können vom selben Auditor
					nicht zertifiziert werden. Wer mich als Berater beauftragt, wählt für
					das Zertifikat eine Zertifizierungsstelle und einen Auditor, mit
					denen ich in diesem Projekt nichts zu tun habe. Dieselbe Regel sorgt
					dafür, dass mein Rat nicht davon abhängt, ob Sie später bei einer
					bestimmten Stelle zertifizieren.
				</p>

				<h2>ISO 27001 und das NISG 2026</h2>
				<p>
					Wer unter das NISG 2026 fällt, muss Risikomanagementmaßnahmen
					umsetzen und nachweisen. Das Gesetz schreibt dafür keine Norm vor,
					erlaubt aber, die operative und organisatorische Umsetzung auch
					durch einschlägige gültige Zertifikate nachzuweisen (§ 33 Abs. 2).
					Ein ISMS nach ISO/IEC 27001 ist deshalb der naheliegende Rahmen: Es
					erzeugt genau die Nachweise, nach denen eine Prüfung fragt.
					Registrierung, Meldepflichten und Selbstdeklaration bleiben eigene
					Pflichten. Mehr dazu auf der Seite zu{" "}
					<Verweis pfad="/nis2-nisg-2026">NIS2 und NISG 2026</Verweis>.
				</p>

				<Fragen fragen={FRAGEN} />
			</Leistungsseite>
			<div className="mx-auto max-w-5xl px-5 pb-12">
				<Handlung />
			</div>
		</>
	);
}
