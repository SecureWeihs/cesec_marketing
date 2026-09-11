import Link from "next/link";
import { site } from "@/lib/site";

const rechtliches = [
	{ pfad: "/impressum", titel: "Impressum" },
	{ pfad: "/datenschutz", titel: "Datenschutz" },
	{ pfad: "/barrierefreiheit", titel: "Barrierefreiheit" },
] as const;

export function Fusszeile() {
	return (
		<footer className="mt-16 border-t border-linie bg-flaeche">
			<div className="mx-auto grid max-w-5xl gap-8 px-5 py-10 text-sm sm:grid-cols-3">
				<div>
					<p className="font-serif text-base font-semibold">{site.name}</p>
					<address className="mt-2 not-italic text-stahl">
						{site.anschrift.strasse}
						<br />
						{site.anschrift.plz} {site.anschrift.ort}
						<br />
						{site.anschrift.land}
					</address>
				</div>

				<div>
					<p className="font-medium">Kontakt</p>
					<ul className="mt-2 space-y-1">
						<li>
							<a href={`tel:${site.telefon.e164}`} className="text-signal">
								{site.telefon.anzeige}
							</a>
						</li>
						<li>
							<a href={`mailto:${site.email}`} className="text-signal">
								{site.email}
							</a>
						</li>
						<li>
							<a
								href={site.linkedin}
								rel="noopener noreferrer me"
								className="text-signal"
							>
								LinkedIn
							</a>
						</li>
					</ul>
				</div>

				<div>
					<p className="font-medium">Rechtliches</p>
					<ul className="mt-2 space-y-1">
						{rechtliches.map((eintrag) => (
							<li key={eintrag.pfad}>
								<Link href={eintrag.pfad} className="text-signal">
									{eintrag.titel}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</footer>
	);
}
