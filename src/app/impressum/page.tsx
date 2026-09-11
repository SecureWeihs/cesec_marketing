import type { Metadata } from "next";
import { impressum } from "@/lib/impressum";
import { site } from "@/lib/site";
import { Textseite } from "@/components/seite";

export const metadata: Metadata = {
	title: "Impressum",
	description:
		"Offenlegung nach § 5 ECG und § 25 Mediengesetz: Firmenwortlaut, Inhaber, Anschrift, Firmenbuch, UID, Gewerbe und Kammerzugehörigkeit der Cesec e. U.",
	robots: { index: true, follow: true },
	openGraph: { images: [{ url: "/og/standard.png", width: 1200, height: 630 }] },
};

/**
 * Sämtliche Angaben stammen aus content/impressum.yaml. Nichts steht hier
 * doppelt: was im Impressum falsch wäre, wäre auch in NAP.md und in den
 * strukturierten Daten falsch — und fiele damit sofort auf.
 */
export default function ImpressumSeite() {
	const { anschrift, firmenbuch, gewerbe, kammer, medien, umsatzsteuer } =
		impressum;

	return (
		<Textseite
			titel="Impressum"
			einleitung="Offenlegung nach § 5 E-Commerce-Gesetz und § 25 Mediengesetz."
			stufen={[{ titel: "Impressum", pfad: "/impressum" }]}
		>
			<h2>Diensteanbieter</h2>
			<dl>
				<dt>Firmenwortlaut</dt>
				<dd>{impressum.firmenwortlaut}</dd>
				<dt>Inhaber</dt>
				<dd>{impressum.inhaber}</dd>
				<dt>Rechtsform</dt>
				<dd>{impressum.rechtsform}</dd>
				<dt>Anschrift</dt>
				<dd>
					{anschrift.strasse}
					<br />
					{anschrift.plz} {anschrift.ort}
					<br />
					{anschrift.land}
				</dd>
				<dt>Telefon</dt>
				<dd>
					<a href={`tel:${site.telefon.e164}`} data-umami-event="telefon">{site.telefon.anzeige}</a>
				</dd>
				<dt>E-Mail</dt>
				<dd>
					<a href={`mailto:${site.email}`} data-umami-event="email">{site.email}</a>
				</dd>
			</dl>

			<h2>Unternehmensgegenstand</h2>
			<p>{impressum.unternehmensgegenstand}</p>

			<h2>Registerangaben</h2>
			<dl>
				<dt>Firmenbuchnummer</dt>
				<dd>{firmenbuch.nummer}</dd>
				<dt>Firmenbuchgericht</dt>
				<dd>{firmenbuch.gericht}</dd>
				<dt>Umsatzsteuer-Identifikationsnummer</dt>
				<dd>{umsatzsteuer.uid}</dd>
			</dl>

			<h2>Gewerberecht</h2>
			<dl>
				<dt>Gewerbewortlaut</dt>
				<dd>{gewerbe.wortlaut}</dd>
				{gewerbe.gisaZahl !== null && (
					<>
						<dt>GISA-Zahl</dt>
						<dd>{gewerbe.gisaZahl}</dd>
					</>
				)}
				<dt>Gewerbebehörde</dt>
				<dd>{gewerbe.behoerde}</dd>
				<dt>Anwendbare Rechtsvorschrift</dt>
				<dd>
					<a href={gewerbe.rechtsvorschriftUrl} rel="noopener noreferrer">
						{gewerbe.rechtsvorschrift}
					</a>
				</dd>
				<dt>Kammerzugehörigkeit</dt>
				<dd>
					{kammer.name}, {kammer.fachgruppe}
					<br />
					<a href={kammer.url} rel="noopener noreferrer">
						wko.at
					</a>
				</dd>
			</dl>

			<h2>Online-Streitbeilegung</h2>
			<p>
				Die Europäische Kommission stellt eine Plattform zur
				Online-Streitbeilegung bereit:{" "}
				<a
					href="https://ec.europa.eu/consumers/odr"
					rel="noopener noreferrer"
				>
					ec.europa.eu/consumers/odr
				</a>
				. Cesec e. U. ist weder bereit noch verpflichtet, an einem
				Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
				teilzunehmen.
			</p>

			<h2>Offenlegung nach § 25 Mediengesetz</h2>
			<dl>
				<dt>Medieninhaber</dt>
				<dd>
					{medien.medieninhaber}, {anschrift.strasse}, {anschrift.plz}{" "}
					{anschrift.ort}
				</dd>
				<dt>Grundlegende Richtung</dt>
				<dd>{medien.grundlegendeRichtung}</dd>
			</dl>

			<h2>Haftung für Inhalte und Verweise</h2>
			<p>
				Die Inhalte dieser Website wurden mit Sorgfalt erstellt. Für
				Richtigkeit, Vollständigkeit und Aktualität wird keine Gewähr
				übernommen. Die Beiträge geben den Rechtsstand zum jeweils
				angegebenen Zeitpunkt wieder und ersetzen keine Rechtsberatung im
				Einzelfall.
			</p>
			<p>
				Für Inhalte fremder Websites, auf die verwiesen wird, ist
				ausschließlich deren Anbieter verantwortlich. Zum Zeitpunkt der
				Verlinkung waren keine Rechtsverstöße erkennbar.
			</p>

			<h2>Urheberrecht</h2>
			<p>
				Die Inhalte dieser Website unterliegen dem österreichischen
				Urheberrecht. Vervielfältigung, Bearbeitung und Verbreitung außerhalb
				der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung.
			</p>
		</Textseite>
	);
}
