import { Brotkrumen } from "@/components/brotkrumen";

/**
 * Rahmen für Leistungsseiten: Brotkrumen, Überschrift, Einleitung, Fließtext.
 * Wie die Textseite, aber mit breiterem Einleitungsbereich und ohne dass jede
 * Leistungsseite ihre Grundstruktur wiederholen muss.
 */
export function Leistungsseite({
	titel,
	einleitung,
	stufen,
	children,
}: {
	titel: string;
	einleitung: string;
	stufen: readonly { titel: string; pfad: string }[];
	children: React.ReactNode;
}) {
	return (
		<article className="mx-auto max-w-5xl px-5 py-12">
			<Brotkrumen stufen={stufen} />
			<h1 className="max-w-[26ch] text-3xl leading-tight sm:text-4xl">{titel}</h1>
			<p className="mt-6 max-w-satz text-lg text-stahl">{einleitung}</p>
			<div className="fliesstext mt-10">{children}</div>
		</article>
	);
}
