import { evaluate } from "@mdx-js/mdx";
import * as laufzeit from "react/jsx-runtime";
import type { Metadata } from "next";
import type { ComponentProps } from "react";
import { leitfaden as artikel } from "@/lib/strukturierte-daten";
import { leitfaeden, leitfadenFuer, saeulen, type Saeule } from "@/lib/leitfaeden";
import { Autorenkasten } from "@/components/autorenkasten";
import { Fragen } from "@/components/fragen";
import { Fristenliste } from "@/components/fristenliste";
import { Handlung } from "@/components/handlung";
import { Leistungsseite } from "@/components/leistungsseite";
import { StrukturierteDaten } from "@/components/strukturierte-daten";
import { Verweis } from "@/components/verweis";

/** Verweise im Fließtext: intern nur, wenn das Ziel existiert; extern mit rel. */
function Anker({ href = "", children }: ComponentProps<"a">) {
	if (href.startsWith("/")) return <Verweis pfad={href}>{children}</Verweis>;
	return (
		<a href={href} rel="noopener noreferrer">
			{children}
		</a>
	);
}

export function parameterFuer(saeule: Saeule) {
	return leitfaeden.filter((l) => l.saeule === saeule).map((l) => ({ leitfaden: l.slug }));
}

export function metadatenFuer(saeule: Saeule, slug: string): Metadata {
	const l = leitfadenFuer(saeule, slug);
	if (!l) return {};
	return {
		title: l.title,
		description: l.description,
		keywords: l.keywords,
		alternates: { canonical: l.pfad },
		openGraph: {
			type: "article",
			images: [{ url: "/og/leitfaden.png", width: 1200, height: 630 }],
		},
	};
}

export async function LeitfadenSeite({ saeule, slug }: { saeule: Saeule; slug: string }) {
	const l = leitfadenFuer(saeule, slug);
	if (!l) return null;

	// Kompiliert beim Vorrendern auf dem Server. Im Browser kommt fertiges HTML
	// an, kein MDX und kein Compiler.
	const { default: Inhalt } = await evaluate(l.inhalt, { ...laufzeit, development: false });

	return (
		<>
			<StrukturierteDaten
				daten={artikel({
					ueberschrift: l.ueberschrift,
					beschreibung: l.description,
					pfad: l.pfad,
					veroeffentlicht: l.datePublished,
					geaendert: l.dateModified,
					suchbegriffe: l.keywords,
				})}
			/>
			<Leistungsseite
				titel={l.ueberschrift}
				einleitung={l.description}
				stufen={[
					{ titel: saeulen[saeule].titel, pfad: saeulen[saeule].pfad },
					{ titel: l.ueberschrift, pfad: l.pfad },
				]}
			>
				<Inhalt components={{ a: Anker, Fristenliste }} />

				{l.quellen.length > 0 && (
					<>
						<h2>Quellen</h2>
						<ul>
							{l.quellen.map((q) => (
								<li key={q.url}>
									<a href={q.url} rel="noopener noreferrer">
										{q.titel}
									</a>
								</li>
							))}
						</ul>
					</>
				)}

				<Fragen fragen={l.fragen} />
				<Autorenkasten />
			</Leistungsseite>
			<div className="mx-auto max-w-5xl px-5 pb-12">
				<Handlung />
			</div>
		</>
	);
}
