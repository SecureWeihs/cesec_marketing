import Link from "next/link";
import { brotkrumen } from "@/lib/strukturierte-daten";
import { StrukturierteDaten } from "@/components/strukturierte-daten";

/**
 * Sichtbarer Pfad plus die dazugehörige Auszeichnung. Beides gehört zusammen:
 * Google erwartet, dass ausgezeichnete Brotkrumen auf der Seite auch zu sehen
 * sind.
 */
export function Brotkrumen({
	stufen,
}: {
	stufen: readonly { titel: string; pfad: string }[];
}) {
	const alle = [{ titel: "Start", pfad: "/" }, ...stufen] as const;

	return (
		<>
			<StrukturierteDaten daten={brotkrumen(alle)} />
			<nav aria-label="Brotkrumen" className="mb-8 text-sm text-stahl">
				<ol className="flex flex-wrap items-center gap-x-2">
					{alle.map((stufe, index) => {
						const letzte = index === alle.length - 1;
						return (
							<li key={stufe.pfad} className="flex items-center gap-x-2">
								{letzte ? (
									<span aria-current="page">{stufe.titel}</span>
								) : (
									<Link href={stufe.pfad} className="text-signal">
										{stufe.titel}
									</Link>
								)}
								{!letzte && <span aria-hidden="true">›</span>}
							</li>
						);
					})}
				</ol>
			</nav>
		</>
	);
}
