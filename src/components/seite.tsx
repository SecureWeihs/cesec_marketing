import { Brotkrumen } from "@/components/brotkrumen";

/**
 * Rahmen für Textseiten: Brotkrumen, Überschrift, Fließtext.
 * Eine h1 je Seite, alles Weitere beginnt bei h2.
 */
export function Textseite({
	titel,
	einleitung,
	stufen,
	children,
}: {
	titel: string;
	einleitung?: string;
	stufen: readonly { titel: string; pfad: string }[];
	children: React.ReactNode;
}) {
	return (
		<div className="mx-auto max-w-5xl px-5 py-12">
			<Brotkrumen stufen={stufen} />
			<h1 className="max-w-satz text-3xl sm:text-4xl">{titel}</h1>
			{einleitung && (
				<p className="mt-5 max-w-satz text-lg text-stahl">{einleitung}</p>
			)}
			<div className="fliesstext mt-10">{children}</div>
		</div>
	);
}
