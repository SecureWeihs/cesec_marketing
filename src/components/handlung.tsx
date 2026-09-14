import { site } from "@/lib/site";

/**
 * Abschluss jeder Leistungs- und Leitfadenseite: das Erstgespräch.
 * Primäre Konversion ist das Telefonat, sekundär die E-Mail.
 */
export function Handlung({
	text = "Ob und was davon auf Ihr Unternehmen zutrifft, lässt sich in einem Gespräch meist klären.",
}: {
	text?: string;
}) {
	return (
		<section aria-label="Erstgespräch" className="mt-14 border-t-2 border-signal pt-8">
			<p className="max-w-satz text-lg">{text}</p>
			<p className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
				<a
					href={`tel:${site.telefon.e164}`} data-umami-event="telefon"
					className="inline-block bg-signal px-5 py-3 font-medium text-papier no-underline hover:bg-signal-tief"
				>
					Erstgespräch: {site.telefon.anzeige}
				</a>
				<a href={`mailto:${site.email}`} data-umami-event="email" className="text-signal underline underline-offset-2">
					{site.email}
				</a>
			</p>
		</section>
	);
}
