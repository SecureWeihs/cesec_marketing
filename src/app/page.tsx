import type { Metadata } from "next";
import Link from "next/link";
import { fristen, fristenQuellen } from "@/lib/fristen";
import { istVerfuegbar, unterseiten } from "@/lib/navigation";
import { site } from "@/lib/site";
import { Bild } from "@/components/bild";
import { Verweis } from "@/components/verweis";

export const metadata: Metadata = {
	title: { absolute: "Externer Informationssicherheitsbeauftragter | Cesec" },
	description:
		"Externer Informationssicherheitsbeauftragter für Unternehmen, die NISG 2026 oder ISO 27001 erfüllen müssen. Von der CIS berufen, Prüfungserfahrung mit der OeNB.",
};

/*
 * Aufbau nach Abschnitt 7.1 des Briefs. Jede Aussage über den Inhaber
 * stammt aus dem Beraterprofil oder dem Brief; freigabepflichtig sind
 * insbesondere die vier Faktenzeilen und die drei Projektskizzen.
 */

const FAKTEN = [
	"Von der CIS für ISO/IEC 27001 berufen",
	"Zuletzt Informationssicherheitsbeauftragter einer österreichischen Landesbank",
	"Begleitung einer sechs Monate laufenden Prüfung der Österreichischen Nationalbank",
	"Wien, Niederösterreich und Umland, überwiegend remote",
] as const;

const LEISTUNGEN = [
	{
		pfad: "/nis2-nisg-2026",
		titel: "NIS2 und NISG 2026",
		text: "Klären, ob und wie Ihr Unternehmen betroffen ist, und die Pflichten so umsetzen, dass sie einer Prüfung durch die Cybersicherheitsbehörde standhalten.",
	},
	{
		pfad: "/iso-27001",
		titel: "ISO 27001",
		text: "Aufbau eines Informationssicherheits-Managementsystems, interne Audits, Voraudit und Begleitung durch Stufe-1- und Stufe-2-Audit.",
	},
	{
		pfad: "/security-services",
		titel: "Security Services",
		text: "Externer Informationssicherheitsbeauftragter, Audits bei Lieferanten, IKT-Risikomanagement, Business Continuity und die Automatisierung wiederkehrender Kontrollen.",
	},
] as const;

const PROJEKTE = [
	{
		umfeld: "IT-naher Dienstleister, KMU",
		text: "Laufende Führung der Informationssicherheit als externer Informationssicherheitsbeauftragter: Anforderungsprüfung gegen NIS2, Schutzbedarfsfeststellungen, Vorfallbehandlung und Begleitung von Change-Projekten.",
	},
	{
		umfeld: "Produzierendes Unternehmen, rund 25 Mitarbeiter",
		text: "Business-Impact-Analyse, Aufbau des Risikomanagements, Dokumentenlenkung und Schutzbedarfsfeststellung, dazu die Automatisierung des Helpdesk-Prozesses.",
	},
	{
		umfeld: "Gemeinnützige Organisation",
		text: "Vollständige Automatisierung des Benutzer- und Berechtigungsmanagements samt Überwachung. Jede Berechtigungsvergabe ist seither lückenlos nachvollziehbar.",
	},
] as const;

function Abschnitt({
	titel,
	id,
	children,
}: {
	titel: string;
	id: string;
	children: React.ReactNode;
}) {
	return (
		<section aria-labelledby={id} className="border-t border-linie py-12">
			<h2 id={id} className="text-2xl">
				{titel}
			</h2>
			<div className="mt-6">{children}</div>
		</section>
	);
}

export default function Startseite() {
	const leitfaeden = unterseiten.filter(
		(seite) => seite.verfuegbar && !seite.pfad.endsWith("betroffenheit-pruefen"),
	);

	return (
		<div className="mx-auto max-w-5xl px-5">
			<section className="py-14 sm:py-20">
				<h1 className="max-w-[24ch] text-4xl leading-tight sm:text-5xl">
					Externer Informationssicherheitsbeauftragter für Unternehmen, die
					NISG 2026 oder ISO 27001 erfüllen müssen.
				</h1>

				<ul className="mt-8 max-w-satz space-y-2 text-stahl">
					{FAKTEN.map((fakt) => (
						<li key={fakt} className="border-l-2 border-linie pl-3">
							{fakt}
						</li>
					))}
				</ul>

				<div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
					<a
						href={`tel:${site.telefon.e164}`} data-umami-event="telefon"
						className="inline-block bg-signal px-5 py-3 font-medium text-papier no-underline hover:bg-signal-tief"
					>
						Erstgespräch vereinbaren: {site.telefon.anzeige}
					</a>
					{istVerfuegbar("/nis2-nisg-2026/betroffenheit-pruefen") && (
						<Link
							href="/nis2-nisg-2026/betroffenheit-pruefen"
							className="text-signal underline underline-offset-2"
						>
							Betroffenheit nach NISG 2026 prüfen
						</Link>
					)}
				</div>
			</section>

			<Abschnitt titel="Fristen nach dem NISG 2026" id="fristen">
				<ol className="max-w-satz">
					{fristen.map((frist) => (
						<li
							key={frist.datum}
							className="grid gap-1 border-t border-linie py-4 first:border-t-0 first:pt-0 sm:grid-cols-[11rem_1fr] sm:gap-6"
						>
							<time dateTime={frist.datum} className="font-medium text-signal">
								{frist.anzeige}
							</time>
							<div>
								<p>{frist.was}</p>
								<p className="mt-1 text-sm text-stahl">{frist.fundstelle}</p>
							</div>
						</li>
					))}
				</ol>
				<p className="mt-6 max-w-satz text-sm text-stahl">
					Fristen nach dem{" "}
					<a href={fristenQuellen.gesetz} rel="noopener noreferrer" className="text-signal underline underline-offset-2">
						Gesetzestext im Rechtsinformationssystem des Bundes
					</a>
					, Kalenderdaten nach den{" "}
					<a href={fristenQuellen.kalenderdaten} rel="noopener noreferrer" className="text-signal underline underline-offset-2">
						Angaben der Wirtschaftskammer
					</a>
					.
				</p>
			</Abschnitt>

			<Abschnitt titel="Leistungen" id="leistungen">
				<ul className="grid gap-8 md:grid-cols-3">
					{LEISTUNGEN.map((leistung) => (
						<li key={leistung.pfad}>
							<h3 className="text-lg">
								<Verweis pfad={leistung.pfad} klasse="text-tinte">
									{leistung.titel}
								</Verweis>
							</h3>
							<p className="mt-2 text-stahl">{leistung.text}</p>
						</li>
					))}
				</ul>
			</Abschnitt>

			<Abschnitt titel="Was ich nicht mache" id="nicht">
				<ul className="max-w-satz space-y-4">
					<li>
						<strong className="font-semibold">Ihr Unternehmen zertifizieren.</strong>{" "}
						Als berufener Auditor unterliege ich der Unabhängigkeitspflicht nach
						ISO/IEC 17021. Wen ich berate, kann ich nicht selbst zertifizieren.
					</li>
					<li>
						<strong className="font-semibold">Provisionen annehmen.</strong>{" "}
						Keine Vergütung von Herstellern oder Softwareanbietern. Eine
						Werkzeugempfehlung hat keinen anderen Grund als die Sache.
					</li>
					<li>
						<strong className="font-semibold">Mehr als vier Tage pro Woche.</strong>{" "}
						Die Kapazität ist begrenzt, damit die Arbeit bei mir bleibt und
						nicht weitergereicht wird.
					</li>
					<li>
						<strong className="font-semibold">Security Operations.</strong>{" "}
						Kein SOC, kein SIEM-Betrieb, keine Rund-um-die-Uhr-Bereitschaft.
						Dafür gibt es spezialisierte Anbieter; bei deren Auswahl und
						Steuerung helfe ich.
					</li>
				</ul>
			</Abschnitt>

			<Abschnitt titel="Zur Person" id="person">
				<div className="grid gap-8 sm:grid-cols-[12rem_1fr] sm:items-start">
					<Bild
						name="portraet-home"
						breite={600}
						hoehe={800}
						alt="Porträt von Sascha Weihs im dunklen Sakko vor grauem Hintergrund."
						klasse="h-auto w-full max-w-48 border border-linie"
					/>
					<div className="max-w-satz">
						<p>
							Dipl.-Ing. Sascha Weihs, Informationssicherheitsbeauftragter mit
							Schwerpunkt auf dem Aufbau und Betrieb von Managementsystemen im
							regulierten Umfeld. Zuletzt in einer österreichischen Landesbank,
							davor mehrjährige Auditpraxis in einem nach ISO/IEC 27001
							zertifizierten IT-Dienstleister.
						</p>
						<p className="mt-4">
							<Link href="/about" className="text-signal underline underline-offset-2">
								Werdegang, Zertifizierungen und Arbeitsweise
							</Link>
						</p>
					</div>
				</div>
			</Abschnitt>

			<Abschnitt titel="Aus der Praxis" id="praxis">
				<ul className="grid gap-8 md:grid-cols-3">
					{PROJEKTE.map((projekt) => (
						<li key={projekt.umfeld}>
							<p className="text-sm font-medium text-stahl">{projekt.umfeld}</p>
							<p className="mt-2">{projekt.text}</p>
						</li>
					))}
				</ul>
				<p className="mt-8 max-w-satz text-stahl">
					Kundennamen nenne ich nicht öffentlich.{" "}
					<Verweis pfad="/referenzen" klasse="text-signal underline underline-offset-2">
						Warum, und woran Sie mich stattdessen messen können
					</Verweis>
					.
				</p>
			</Abschnitt>

			{leitfaeden.length > 0 && (
				<Abschnitt titel="Leitfäden" id="leitfaeden">
					<ul className="max-w-satz space-y-2">
						{leitfaeden.map((seite) => (
							<li key={seite.pfad}>
								<Link href={seite.pfad} className="text-signal underline underline-offset-2">
									{seite.titel}
								</Link>
							</li>
						))}
					</ul>
				</Abschnitt>
			)}

			<Abschnitt titel="Kontakt" id="kontakt">
				<p className="max-w-satz">
					Am schnellsten telefonisch. Auf E-Mails antworte ich innerhalb eines
					Werktags.
				</p>
				<p className="mt-4">
					<a
						href={`tel:${site.telefon.e164}`} data-umami-event="telefon"
						className="font-serif text-3xl font-semibold text-signal no-underline"
					>
						{site.telefon.anzeige}
					</a>
				</p>
				<p className="mt-2">
					<a href={`mailto:${site.email}`} data-umami-event="email" className="text-signal underline underline-offset-2">
						{site.email}
					</a>
				</p>
			</Abschnitt>
		</div>
	);
}
