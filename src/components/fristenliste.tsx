import { fristen, fristenQuellen } from "@/lib/fristen";

/** Fristen nach dem NISG 2026 mit Fundstelle. Eine Quelle für alle Seiten. */
export function Fristenliste() {
	return (
		<>
			<ol className="!list-none !pl-0">
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
							<p className="!mt-1 text-sm text-stahl">{frist.fundstelle}</p>
						</div>
					</li>
				))}
			</ol>
			<p className="text-sm text-stahl">
				Fristen nach dem{" "}
				<a href={fristenQuellen.gesetz} rel="noopener noreferrer">
					Gesetzestext im Rechtsinformationssystem des Bundes
				</a>
				, Kalenderdaten nach den{" "}
				<a href={fristenQuellen.kalenderdaten} rel="noopener noreferrer">
					Angaben der Wirtschaftskammer
				</a>
				.
			</p>
		</>
	);
}
