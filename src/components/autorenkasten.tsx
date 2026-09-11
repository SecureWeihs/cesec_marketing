import Link from "next/link";
import { site } from "@/lib/site";
import { Bild } from "@/components/bild";

/** Autorenkasten am Ende jedes Leitfadens (Abschnitt 9.5 des Briefs). */
export function Autorenkasten() {
	return (
		<aside aria-label="Über den Autor" className="mt-14 flex flex-col gap-5 border border-linie bg-flaeche p-6 sm:flex-row">
			<Bild
				name="portraet-autor"
				breite={160}
				hoehe={160}
				alt="Porträt von Sascha Weihs."
				klasse="h-24 w-24 shrink-0 border border-linie sm:h-28 sm:w-28"
			/>
			<div>
				<p className="font-serif text-lg font-semibold">Dipl.-Ing. Sascha Weihs</p>
				<p className="mt-1 text-stahl">
					Informationssicherheitsbeauftragter. Von der CIS für ISO/IEC 27001
					berufen, Information Security Auditor und Information Security
					Manager (CIS, nach EN ISO/IEC 17024).
				</p>
				<p className="mt-3">
					<a href={`tel:${site.telefon.e164}`} className="text-signal">{site.telefon.anzeige}</a>
					{" · "}
					<a href={`mailto:${site.email}`} className="text-signal">{site.email}</a>
					{" · "}
					<Link href="/about" className="text-signal underline underline-offset-2">Werdegang</Link>
				</p>
			</div>
		</aside>
	);
}
