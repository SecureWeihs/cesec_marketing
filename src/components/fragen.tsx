import { haeufigeFragen } from "@/lib/strukturierte-daten";
import { StrukturierteDaten } from "@/components/strukturierte-daten";

/**
 * Sichtbare Fragen und ihre Auszeichnung aus derselben Liste, damit beides
 * nie auseinanderläuft. Als <details>: ohne JavaScript bedienbar, mit Tastatur
 * erreichbar, und der Browser liefert die Semantik mit.
 */
export function Fragen({
	fragen,
	titel = "Häufige Fragen",
}: {
	fragen: readonly { frage: string; antwort: string }[];
	titel?: string;
}) {
	return (
		<section aria-labelledby="haeufige-fragen" className="mt-14">
			<StrukturierteDaten daten={haeufigeFragen(fragen)} />
			<h2 id="haeufige-fragen" className="text-2xl">
				{titel}
			</h2>
			<div className="mt-6 max-w-satz divide-y divide-linie border-y border-linie">
				{fragen.map((eintrag) => (
					<details key={eintrag.frage} className="group py-4">
						<summary className="cursor-pointer list-none font-medium marker:hidden">
							<span className="mr-2 inline-block text-signal group-open:rotate-90" aria-hidden="true">
								›
							</span>
							{eintrag.frage}
						</summary>
						<p className="mt-3 pl-5">{eintrag.antwort}</p>
					</details>
				))}
			</div>
		</section>
	);
}
