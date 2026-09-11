import Link from "next/link";
import { hauptnavigation, site } from "@/lib/site";
import { Logo } from "@/components/logo";

/**
 * Telefonnummer permanent sichtbar, auf Mobil als Tap-to-Call.
 */
export function Kopfzeile() {
	return (
		<header className="border-b border-linie">
			<div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4">
				<Link
					href="/"
					className="flex items-center gap-2.5 text-tinte no-underline"
					aria-label="Cesec, zur Startseite"
				>
					<Logo klasse="h-7 w-auto text-signal" titel="" />
					<span className="font-serif text-xl font-semibold tracking-tight">
						Cesec
					</span>
				</Link>

				<nav aria-label="Hauptnavigation" className="order-3 w-full sm:order-2 sm:w-auto">
					<ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
						{hauptnavigation
							.filter((eintrag) => eintrag.pfad !== "/")
							.map((eintrag) => (
								<li key={eintrag.pfad}>
									<Link
										href={eintrag.pfad}
										className="text-stahl no-underline hover:text-signal hover:underline"
									>
										{eintrag.titel}
									</Link>
								</li>
							))}
					</ul>
				</nav>

				<a
					href={`tel:${site.telefon.e164}`}
					className="order-2 text-sm font-medium text-signal no-underline sm:order-3"
				>
					{site.telefon.anzeige}
				</a>
			</div>
		</header>
	);
}
