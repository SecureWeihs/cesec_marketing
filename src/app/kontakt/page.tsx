import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Textseite } from "@/components/seite";

export const metadata: Metadata = {
	title: "Kontakt: Erstgespräch zu NISG 2026 und ISO 27001",
	description:
		"Telefon, E-Mail und Postanschrift der Cesec e. U. Rückmeldung innerhalb eines Werktags. Kein Kontaktformular — Sie erreichen mich direkt per Telefon.",
	openGraph: { images: [{ url: "/og/standard.png", width: 1200, height: 630 }] },
};

/*
 * Bewusst kein Kontaktformular (Entscheidung des Inhabers). Damit entfallen
 * Formularverarbeitung, Spam-Schutz und jede Datenverarbeitung auf der Website.
 */
export default function KontaktSeite() {
	const { anschrift } = site;

	return (
		<Textseite
			titel="Kontakt"
			einleitung="Am schnellsten geht es telefonisch. Auf E-Mails antworte ich innerhalb eines Werktags."
			stufen={[{ titel: "Kontakt", pfad: "/kontakt" }]}
		>
			<p className="!mt-0">
				<a
					href={`tel:${site.telefon.e164}`} data-umami-event="telefon"
					className="font-serif text-3xl font-semibold !no-underline sm:text-4xl"
				>
					{site.telefon.anzeige}
				</a>
			</p>

			<dl>
				<dt>E-Mail</dt>
				<dd>
					<a href={`mailto:${site.email}`} data-umami-event="email">{site.email}</a>
				</dd>
				<dt>Postanschrift</dt>
				<dd>
					{site.name}
					<br />
					{anschrift.strasse}
					<br />
					{anschrift.plz} {anschrift.ort}
					<br />
					{anschrift.land}
				</dd>
				<dt>Einsatzraum</dt>
				<dd>Wien, Niederösterreich und Umland, überwiegend remote möglich</dd>
			</dl>

			<h2>Für das erste Gespräch</h2>
			<p>Hilfreich, aber keine Voraussetzung:</p>
			<ul>
				<li>Branche und ungefähre Größe Ihres Unternehmens</li>
				<li>
					der Anlass — NISG 2026, eine angestrebte Zertifizierung, ein
					Fragebogen eines Kunden oder eine anstehende Prüfung
				</li>
				<li>bis wann etwas stehen muss</li>
			</ul>
			<p>
				Den Preisrahmen nenne ich im Erstgespräch, nicht nach drei Terminen.
			</p>

			<h2>Warum es kein Kontaktformular gibt</h2>
			<p>
				Ein Formular wäre ein zusätzlicher Weg, auf dem Daten verarbeitet und
				gespeichert werden, und bräuchte einen Spam-Schutz. Telefon und E-Mail
				erreichen mich ohne diesen Umweg.
			</p>
		</Textseite>
	);
}
