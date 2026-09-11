import type { Metadata } from "next";
import { site } from "@/lib/site";
import { anlagenQuelle } from "@/lib/sektoren";
import { Leistungsseite } from "@/components/leistungsseite";
import { Selbstcheck } from "@/components/selbstcheck";
import { Verweis } from "@/components/verweis";

export const metadata: Metadata = {
	title: "NISG 2026: Betroffenheit prüfen in fünf Schritten",
	description:
		"Selbstcheck zum NISG 2026: wesentliche oder wichtige Einrichtung, nicht erfasst oder Einzelfall. Nur in Ihrem Browser, ohne Anmeldung, jede Regel belegt.",
	openGraph: { images: [{ url: "/og/leistung.png", width: 1200, height: 630 }] },
};

/*
 * Brief, Abschnitt 7.3. Die Regeln stehen mit Fundstellen in
 * src/lib/einstufung.ts und sind in tests/einstufung.test.ts geprüft.
 * Dieser Server-Teil liefert die statische Erklärung, die auch ohne
 * JavaScript lesbar ist; der interaktive Teil ergänzt sie.
 */
export default function BetroffenheitSeite() {
	return (
		<Leistungsseite
			titel="Betroffen vom NISG 2026? Prüfen Sie es in fünf Schritten."
			einleitung="Tätigkeit, Sonderregeln, Größe, Konzern, Niederlassung. Das Ergebnis erscheint sofort, mit den Pflichten und Fristen, die daraus folgen — ohne E-Mail-Adresse, ohne Anmeldung."
			stufen={[
				{ titel: "NIS2 & NISG 2026", pfad: "/nis2-nisg-2026" },
				{ titel: "Betroffenheit prüfen", pfad: "/nis2-nisg-2026/betroffenheit-pruefen" },
			]}
		>
			<p className="border-l-2 border-signal pl-4">
				<strong>Ihre Eingaben verlassen Ihren Browser nicht.</strong> Keine
				Übertragung, keine Speicherung, kein Cookie.
			</p>

			<noscript>
				<p>
					Der interaktive Selbstcheck braucht JavaScript. Die Regeln, nach denen
					er einstuft, stehen unten vollständig — Sie können sie auch ohne ihn
					anwenden.
				</p>
			</noscript>

			<Selbstcheck telefon={site.telefon.anzeige} telefonE164={site.telefon.e164} />

			<h2>Nach welchen Regeln eingestuft wird</h2>
			<p>
				Die Einstufung folgt § 24 NISG 2026 in Verbindung mit den Anlagen 1 und 2
				(<a href={anlagenQuelle[1]} rel="noopener noreferrer">Anlage 1</a>,{" "}
				<a href={anlagenQuelle[2]} rel="noopener noreferrer">Anlage 2</a>) und den
				Größenschwellen aus § 25.
			</p>
			<table>
				<thead>
					<tr>
						<th scope="col">Tätigkeit</th>
						<th scope="col">großes Unternehmen</th>
						<th scope="col">mittleres Unternehmen</th>
						<th scope="col">kleineres Unternehmen</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">Anlage 1</th>
						<td>wesentlich</td>
						<td>wichtig</td>
						<td>nicht erfasst¹</td>
					</tr>
					<tr>
						<th scope="row">Anlage 2</th>
						<td>wichtig</td>
						<td>wichtig</td>
						<td>nicht erfasst¹</td>
					</tr>
					<tr>
						<th scope="row">keiner der Sektoren</th>
						<td colSpan={3}>nicht erfasst¹</td>
					</tr>
				</tbody>
			</table>
			<p className="text-sm text-stahl">
				¹ Außer eine größenunabhängige Sonderregel greift oder die Behörde stuft
				per Bescheid ein (§ 24, § 26).
			</p>
			<ul>
				<li>
					<strong>Großes Unternehmen:</strong> zumindest 250 Mitarbeiter, oder
					Jahresumsatz über 50 Millionen Euro und zugleich Jahresbilanzsumme über
					43 Millionen Euro (§ 25 Abs. 2).
				</li>
				<li>
					<strong>Mittleres Unternehmen:</strong> zumindest 50 Mitarbeiter, oder
					Jahresumsatz über 10 Millionen Euro und zugleich Jahresbilanzsumme über
					10 Millionen Euro (§ 25 Abs. 3).
				</li>
				<li>
					<strong>Unabhängig von der Größe wesentlich:</strong> qualifizierte
					Vertrauensdiensteanbieter, TLD-Namenregister, DNS-Diensteanbieter,
					öffentliche Verwaltung des Bundes, kritische Einrichtungen nach der
					Richtlinie (EU) 2022/2557, per Bescheid eingestufte Einrichtungen
					(§ 24 Abs. 1 Z 1). Mittlere Kommunikationsanbieter ebenfalls (§ 24
					Abs. 1 Z 2).
				</li>
				<li>
					<strong>Unabhängig von der Größe wichtig:</strong> Anbieter
					öffentlicher Kommunikationsnetze und -dienste, Vertrauensdiensteanbieter,
					öffentliche Verwaltung der Länder, per Bescheid eingestufte
					Einrichtungen (§ 24 Abs. 2).
				</li>
				<li>
					<strong>Niederlassung:</strong> erfasst sind grundsätzlich Einrichtungen
					mit Niederlassung in Österreich; für Kommunikations-, Cloud-,
					Rechenzentrums- und verwaltete IT-Dienste sowie Online-Plattformen
					gelten eigene Regeln (§ 28).
				</li>
			</ul>
			<p>
				Wo eine Antwort fehlt oder mehrere Einstufungen möglich sind, gibt der
				Selbstcheck keine Vermutung aus, sondern „Einzelfallprüfung“.
			</p>

			<h2>Was der Selbstcheck nicht leistet</h2>
			<p>
				Er ist eine Orientierungshilfe, keine Rechtsberatung. Die Anlagen
				bestimmen die Arten von Einrichtungen oft mit Verweis auf Fachgesetze und
				Wirtschaftszweige; ob Ihre Tätigkeit genau darunter fällt, zeigt erst der
				Blick in die Anlage. Die Einstufung nimmt Ihr Unternehmen selbst vor, und
				die Cybersicherheitsbehörde kann sie überprüfen.
			</p>
			<p>
				Weiter mit den{" "}
				<Verweis pfad="/nis2-nisg-2026/fristen-und-registrierung">
					Fristen und der Registrierung
				</Verweis>{" "}
				oder zurück zur{" "}
				<Verweis pfad="/nis2-nisg-2026">Übersicht NIS2 und NISG 2026</Verweis>.
			</p>
		</Leistungsseite>
	);
}
