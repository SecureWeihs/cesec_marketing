import type { Metadata } from "next";
import { analyse } from "@/lib/analyse";
import { impressum } from "@/lib/impressum";
import { site } from "@/lib/site";
import { Textseite } from "@/components/seite";

export const metadata: Metadata = {
	title: "Datenschutzerklärung für die Website cesec.at",
	description:
		"Welche Daten diese Website verarbeitet, auf welcher Rechtsgrundlage, wo sie liegen und welche Rechte Sie haben. Ohne Cookies und ohne Einwilligungsbanner.",
	openGraph: { images: [{ url: "/og/standard.png", width: 1200, height: 630 }] },
};

/** Stand der Erklärung. Wird bei jeder inhaltlichen Änderung mitgezogen. */
const STAND = "2026-09-11";

/*
 * Die Reichweitenmessung (src/lib/analyse.ts) und ihr Abschnitt hier
 * schalten sich gemeinsam: Ist die Messung aus, steht in Abschnitt 2, dass
 * keine Analyse stattfindet, und der Abschnitt zur Messung fehlt. Die
 * Angaben zu Umami sind am Quellcode von Umami 3.3.1 geprüft (gespeicherte
 * Felder in api/send, Sitzungskennung in lib/crypto, Tracker-Felder).
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
				<a href={`mailto:${site.email}`} data-umami-event="email">{site.email}</a>
				<br />
				<a href={`tel:${site.telefon.e164}`} data-umami-event="telefon">{site.telefon.anzeige}</a>
			</p>

			<h2>2. Grundsatz</h2>
			<p>
				Diese Website erhebt so wenig Daten wie möglich. Sie setzt{" "}
				<strong>keine Cookies</strong> und bindet <strong>keine Dienste
				Dritter</strong> ein.{" "}
				{analyse.aktiv ? (
					<>
						Zur Reichweitenmessung wird eine selbst betriebene Instanz der
						Software Umami verwendet, ohne Cookies und ohne Speicherung von
						IP-Adressen (Abschnitt 6).
					</>
				) : (
					<>
						Sie verwendet <strong>keine Analyse-Software</strong>.
					</>
				)}{" "}
				Es werden keine Inhalte von fremden Servern nachgeladen — Schriften,
				Bilder und Skripte liegen ausschließlich auf dem eigenen Server. Ihr
				Browser stellt beim Aufruf dieser Seite also keine Verbindung zu
				Dritten her.
			</p>
			<p>
				Weil keine Cookies gesetzt werden, gibt es auch kein
				Einwilligungsbanner. Sollte sich das ändern, wird diese Erklärung
				vorher angepasst und, soweit erforderlich, eine echte Einwilligung
				eingeholt.
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

			{analyse.aktiv && analyse.aufbewahrungMonate !== null && analyse.datenbank !== null && (
				<>
					<h2>6. Reichweitenmessung mit Umami</h2>
					<p>
						Um zu verstehen, welche Inhalte gelesen werden und über welche Wege
						Besucher auf diese Website kommen, wird die Open-Source-Software
						Umami eingesetzt. Sie läuft auf eigener Infrastruktur, nicht bei
						einem Analyseanbieter. Ihr Browser spricht dabei nur mit dieser
						Website; die Daten werden serverseitig an die Umami-Instanz
						weitergegeben.
					</p>
					<dl>
						<dt>Erfasste Daten</dt>
						<dd>
							Aufgerufene Adresse und Seitentitel, verweisende Seite, Browser,
							Betriebssystem, Gerätetyp, Bildschirmgröße, Sprache sowie Land,
							Region und Stadt, abgeleitet aus der IP-Adresse. Dazu anonyme
							Zählereignisse: Klick auf die Telefonnummer, Klick auf die
							E-Mail-Adresse, Abschluss des Selbstchecks — ohne Inhalte oder
							Eingaben.
						</dd>
						<dt>Keine IP-Adressen, keine Cookies</dt>
						<dd>
							Die IP-Adresse wird nicht gespeichert. Aus IP-Adresse,
							Browserkennung und einem{" "}
							{analyse.saltWechsel === "day" ? "täglich" : analyse.saltWechsel === "week" ? "wöchentlich" : "monatlich"}{" "}
							wechselnden Zufallswert wird eine Einweg-Kennung gebildet, mit der
							sich Aufrufe derselben Sitzung zusammenfassen lassen. Nach dem
							Wechsel des Zufallswerts ist keine Verbindung zu früheren
							Aufrufen mehr möglich. Es werden keine Cookies gesetzt und nichts
							im Browser gespeichert. Ist in Ihrem Browser „Do Not Track“
							aktiviert, findet keine Messung statt.
						</dd>
						<dt>Zweck</dt>
						<dd>Verbesserung der Inhalte und Messung der Reichweite</dd>
						<dt>Rechtsgrundlage</dt>
						<dd>
							Art. 6 Abs. 1 lit. f DSGVO, berechtigtes Interesse an einer
							datensparsamen Reichweitenmessung
						</dd>
						<dt>Speicherdauer</dt>
						<dd>{analyse.aufbewahrungMonate} Monate, danach werden die Daten gelöscht</dd>
						<dt>Betrieb</dt>
						<dd>
							Umami-Instanz bei Vercel Inc., Region Frankfurt am Main;
							Datenbank bei {analyse.datenbank.anbieter}, Region{" "}
							{analyse.datenbank.region}
						</dd>
					</dl>
				</>
			)}

			<h2>{analyse.aktiv ? "7" : "6"}. Auftragsverarbeiter</h2>
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

			<h2>{analyse.aktiv ? "8" : "7"}. Speicherdauer</h2>
			<p>
				Personenbezogene Daten werden nur so lange gespeichert, wie es für den
				jeweiligen Zweck erforderlich ist oder gesetzliche
				Aufbewahrungspflichten es verlangen. E-Mail-Verkehr wird nach
				Abschluss des Vorgangs gelöscht, soweit keine längere Aufbewahrung
				vorgeschrieben ist.
			</p>

			<h2>{analyse.aktiv ? "9" : "8"}. Ihre Rechte</h2>
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
				<a href={`mailto:${site.email}`} data-umami-event="email">{site.email}</a>.
			</p>

			<h2>{analyse.aktiv ? "10" : "9"}. Beschwerderecht</h2>
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

			<h2>{analyse.aktiv ? "11" : "10"}. Stand</h2>
			<p>
				Diese Erklärung hat den Stand vom{" "}
				<time dateTime={STAND}>11. September 2026</time>. Sie wird angepasst,
				wenn sich die Website oder die rechtlichen Anforderungen ändern.
			</p>
		</Textseite>
	);
}
