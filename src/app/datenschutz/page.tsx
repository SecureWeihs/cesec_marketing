import type { Metadata } from "next";
import { impressum } from "@/lib/impressum";
import { site } from "@/lib/site";
import { Textseite } from "@/components/seite";

export const metadata: Metadata = {
	title: "Datenschutzerklärung",
	description:
		"Welche Daten diese Website verarbeitet, auf welcher Rechtsgrundlage, wo sie liegen und welche Rechte Sie haben. Ohne Cookies, ohne Tracking, ohne Einwilligungsbanner.",
	openGraph: { images: [{ url: "/og/standard.png", width: 1200, height: 630 }] },
};

/** Stand der Erklärung. Wird bei jeder inhaltlichen Änderung mitgezogen. */
const STAND = "2026-09-11";

/*
 * TODO(schritt-8): Sobald die Reichweitenmessung (Umami, eigene Instanz in der
 * EU) in Betrieb geht, kommt hier ein eigener Abschnitt dazu: Werkzeug, Zweck,
 * Rechtsgrundlage, Speicherdauer, Hosting. Bis dahin beschreibt Abschnitt 2
 * den tatsächlichen Zustand — es findet keine Analyse statt.
 *
 * TODO(inhaber): Anbieter des Postfachs sw@cesec.at und alle weiteren Systeme,
 * die unter cesec.at versenden, für die Liste der Auftragsverarbeiter.
 */
export default function DatenschutzSeite() {
	const { anschrift } = impressum;

	return (
		<Textseite
			titel="Datenschutzerklärung"
			einleitung="Diese Website kommt ohne Cookies, ohne Tracking und ohne Einwilligungsbanner aus. Was trotzdem an Daten anfällt, steht hier."
			stufen={[{ titel: "Datenschutz", pfad: "/datenschutz" }]}
		>
			<h2>1. Verantwortlicher</h2>
			<p>
				Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) und
				des österreichischen Datenschutzgesetzes (DSG) ist:
			</p>
			<p>
				{impressum.firmenwortlaut}
				<br />
				{impressum.inhaber}
				<br />
				{anschrift.strasse}
				<br />
				{anschrift.plz} {anschrift.ort}
				<br />
				{anschrift.land}
				<br />
				<a href={`mailto:${site.email}`}>{site.email}</a>
				<br />
				<a href={`tel:${site.telefon.e164}`}>{site.telefon.anzeige}</a>
			</p>

			<h2>2. Grundsatz</h2>
			<p>
				Diese Website erhebt so wenig Daten wie möglich. Sie setzt{" "}
				<strong>keine Cookies</strong>, bindet <strong>keine Dienste
				Dritter</strong> ein und verwendet <strong>keine
				Analyse-Software</strong>. Es werden keine Inhalte von fremden Servern
				nachgeladen — Schriften, Bilder und Skripte liegen ausschließlich auf
				dem eigenen Server. Ihr Browser stellt beim Aufruf dieser Seite also
				keine Verbindung zu Dritten her.
			</p>
			<p>
				Weil keine Cookies gesetzt werden und keine Analyse stattfindet, gibt
				es auch kein Einwilligungsbanner. Sollte sich das ändern, wird diese
				Erklärung vorher angepasst und, soweit erforderlich, eine echte
				Einwilligung eingeholt.
			</p>

			<h2>3. Hosting und Server-Protokolle</h2>
			<p>
				Die Website wird von der Vercel Inc., 440 N Barranca Avenue #4133,
				Covina, CA 91723, USA betrieben. Die Auslieferung erfolgt aus der
				Region Frankfurt am Main.
			</p>
			<p>
				Beim Abruf entstehen technisch bedingt Protokolldaten, die folgende
				Angaben enthalten können: gekürzte oder vollständige IP-Adresse,
				Datum und Uhrzeit, abgerufene Adresse, übertragene Datenmenge,
				Meldung über den Erfolg des Abrufs sowie Browsertyp und
				Betriebssystem.
			</p>
			<dl>
				<dt>Zweck</dt>
				<dd>Betrieb, Sicherheit und Fehlersuche</dd>
				<dt>Rechtsgrundlage</dt>
				<dd>
					Art. 6 Abs. 1 lit. f DSGVO, berechtigtes Interesse am sicheren und
					störungsfreien Betrieb
				</dd>
				<dt>Speicherdauer</dt>
				<dd>kurzfristig, ausschließlich beim Dienstleister</dd>
				<dt>Drittlandübermittlung</dt>
				<dd>
					Vercel Inc. hat sich gegenüber dem US-Handelsministerium zur
					Einhaltung des EU-U.S. Data Privacy Framework verpflichtet. Für die
					Auftragsverarbeitung gelten zusätzlich die Standardvertragsklauseln.
				</dd>
			</dl>

			<h2>4. Kontaktaufnahme</h2>
			<p>
				Diese Website enthält <strong>kein Kontaktformular</strong>. Kontakt
				kommt ausschließlich per E-Mail oder Telefon zustande.
			</p>
			<p>
				Wenn Sie schreiben oder anrufen, verarbeite ich die dabei
				übermittelten Angaben — Name, E-Mail-Adresse oder Telefonnummer sowie
				den Inhalt Ihrer Anfrage — zur Bearbeitung und für Anschlussfragen.
				Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO bei Anfragen zur
				Anbahnung eines Vertrags, sonst Art. 6 Abs. 1 lit. f DSGVO,
				berechtigtes Interesse an der Beantwortung. Eine Weitergabe an Dritte
				findet nicht statt.
			</p>

			<h2>5. Verweise auf LinkedIn</h2>
			<p>
				Auf dieser Website stehen Textverweise auf ein Profil bei LinkedIn
				(LinkedIn Ireland Unlimited Company, Wilton Place, Dublin 2, Irland).
				Es sind reine Verweise, keine eingebetteten Inhalte und keine
				Schaltflächen: Ihr Browser nimmt erst dann Verbindung zu LinkedIn auf,
				wenn Sie einen solchen Verweis anklicken. Ab diesem Zeitpunkt gilt die
				Datenschutzerklärung von LinkedIn.
			</p>

			<h2>6. Auftragsverarbeiter</h2>
			<table>
				<thead>
					<tr>
						<th>Dienstleister</th>
						<th>Zweck</th>
						<th>Verarbeitungsort</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Vercel Inc., USA</td>
						<td>Hosting und Auslieferung der Website</td>
						<td>Frankfurt am Main, Unternehmenssitz USA</td>
					</tr>
				</tbody>
			</table>
			<p>
				Für den E-Mail-Verkehr wird ein Postfach betrieben; der Anbieter wird
				hier ergänzt, sobald die Angaben vollständig vorliegen. Weitere
				Auftragsverarbeiter werden für den Betrieb dieser Website nicht
				eingesetzt.
			</p>

			<h2>7. Speicherdauer</h2>
			<p>
				Personenbezogene Daten werden nur so lange gespeichert, wie es für den
				jeweiligen Zweck erforderlich ist oder gesetzliche
				Aufbewahrungspflichten es verlangen. E-Mail-Verkehr wird nach
				Abschluss des Vorgangs gelöscht, soweit keine längere Aufbewahrung
				vorgeschrieben ist.
			</p>

			<h2>8. Ihre Rechte</h2>
			<p>Ihnen stehen gegenüber dem Verantwortlichen folgende Rechte zu:</p>
			<ul>
				<li>Auskunft über die zu Ihrer Person verarbeiteten Daten (Art. 15 DSGVO)</li>
				<li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
				<li>Löschung (Art. 17 DSGVO)</li>
				<li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
				<li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
				<li>
					Widerspruch gegen Verarbeitungen, die auf einem berechtigten
					Interesse beruhen (Art. 21 DSGVO)
				</li>
			</ul>
			<p>
				Zur Ausübung genügt eine formlose Nachricht an{" "}
				<a href={`mailto:${site.email}`}>{site.email}</a>.
			</p>

			<h2>9. Beschwerderecht</h2>
			<p>
				Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren.
				Zuständig ist in Österreich die Datenschutzbehörde, Barichgasse 40–42,
				1030 Wien,{" "}
				<a href="mailto:dsb@dsb.gv.at">dsb@dsb.gv.at</a>,{" "}
				<a href="https://www.dsb.gv.at" rel="noopener noreferrer">
					dsb.gv.at
				</a>
				.
			</p>

			<h2>10. Stand</h2>
			<p>
				Diese Erklärung hat den Stand vom{" "}
				<time dateTime={STAND}>11. September 2026</time>. Sie wird angepasst,
				wenn sich die Website oder die rechtlichen Anforderungen ändern.
			</p>
		</Textseite>
	);
}
