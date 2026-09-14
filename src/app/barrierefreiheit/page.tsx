import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Textseite } from "@/components/seite";

export const metadata: Metadata = {
	title: "Erklärung zur Barrierefreiheit der Website cesec.at",
	description:
		"Stand der Barrierefreiheit dieser Website nach WCAG 2.1 AA: umgesetzte und geprüfte Punkte, bekannte Einschränkungen und wie Sie eine Barriere melden können.",
	alternates: { canonical: "/barrierefreiheit" },
	openGraph: { images: [{ url: "/og/standard.png", width: 1200, height: 630 }] },
};

const STAND = "2026-09-11";

export default function BarrierefreiheitSeite() {
	return (
		<Textseite
			titel="Barrierefreiheit"
			einleitung="Diese Website soll für alle nutzbar sein — mit Tastatur, mit Screenreader, bei eingeschränktem Sehvermögen und ohne JavaScript."
			stufen={[{ titel: "Barrierefreiheit", pfad: "/barrierefreiheit" }]}
		>
			<h2>Angestrebter Standard</h2>
			<p>
				Ziel sind die Web Content Accessibility Guidelines 2.1 in der
				Konformitätsstufe AA. Diese Erklärung beschreibt den tatsächlichen
				Stand, nicht eine Absichtserklärung.
			</p>

			<h2>Umgesetzt</h2>
			<ul>
				<li>
					Vollständige Bedienbarkeit mit der Tastatur, mit sichtbarem
					Fokusindikator und einer Sprungmarke zum Inhalt.
				</li>
				<li>
					Semantisches HTML. ARIA-Attribute nur dort, wo natives HTML nicht
					ausreicht.
				</li>
				<li>
					Kontraste über den Anforderungen: 16,2:1 für Fließtext, 6,7:1 für
					Sekundärtext, 8,6:1 für Verweise und Signalfarbe. Verlangt sind
					4,5:1 beziehungsweise 3:1.
				</li>
				<li>Genau eine Hauptüberschrift je Seite, lückenlose Gliederung.</li>
				<li>
					Bewegung nur als Antwort auf eine Eingabe. Die
					Systemeinstellung für reduzierte Bewegung wird beachtet.
				</li>
				<li>
					Bilder tragen beschreibende Alternativtexte in ganzen Sätzen.
				</li>
				<li>
					Der Text lässt sich auf 200 Prozent vergrößern, ohne dass Inhalte
					verloren gehen oder waagrecht gescrollt werden muss.
				</li>
			</ul>

			<h2>Wie geprüft wird</h2>
			<p>
				Jede Änderung durchläuft eine automatisierte Prüfung mit axe-core.
				Automatische Werkzeuge finden allerdings nur einen Teil der
				möglichen Barrieren, deshalb kommt eine manuelle Prüfung mit Tastatur
				und Screenreader dazu.
			</p>

			<h2>Bekannte Einschränkungen</h2>
			<p>
				Derzeit sind keine Barrieren bekannt. Diese Liste wird geführt und
				ergänzt, sobald eine gemeldet oder festgestellt wird — eine leere
				Liste bedeutet nicht, dass es nichts zu finden gibt.
			</p>

			<h2>Barriere melden</h2>
			<p>
				Wenn Ihnen etwas auffällt, das die Nutzung erschwert, schreiben Sie
				bitte an <a href={`mailto:${site.email}`} data-umami-event="email">{site.email}</a> oder rufen
				Sie an: <a href={`tel:${site.telefon.e164}`} data-umami-event="telefon">{site.telefon.anzeige}</a>.
				Eine Rückmeldung erfolgt innerhalb eines Werktags. Hilfreich ist die
				Angabe, welche Seite betroffen ist und womit Sie die Seite bedienen.
			</p>
			<p>
				Falls Sie mit der Antwort nicht zufrieden sind, können Sie sich an die
				Österreichische Arbeitsgemeinschaft für Rehabilitation oder an den
				Sozialministeriumservice wenden.
			</p>

			<h2>Stand</h2>
			<p>
				Diese Erklärung hat den Stand vom{" "}
				<time dateTime={STAND}>11. September 2026</time>.
			</p>
		</Textseite>
	);
}
