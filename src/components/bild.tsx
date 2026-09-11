/**
 * Bild mit AVIF und WebP in einfacher und doppelter Auflösung.
 *
 * Bewusst ohne next/image: die Komponente setzt Inline-Styles, die die
 * Content-Security-Policy nicht erlaubt. Die Varianten erzeugt
 * scripts/assets.mjs zur Bauzeit; hier wird nur das Markup geschrieben.
 * Breite und Höhe sind Pflicht, damit der Browser den Platz reserviert,
 * bevor das Bild da ist — sonst verschiebt sich die Seite beim Laden.
 */
export function Bild({
	name,
	breite,
	hoehe,
	alt,
	vorrang = false,
	klasse,
}: {
	/** Dateiname unter public/bilder, ohne Endung und ohne @2x. */
	name: string;
	breite: number;
	hoehe: number;
	/** Als ganzer Satz. */
	alt: string;
	/** Nur für das größte Bild im ersten Bildschirm. */
	vorrang?: boolean;
	klasse?: string;
}) {
	const pfad = `/bilder/${name}`;
	return (
		<picture>
			<source
				type="image/avif"
				srcSet={`${pfad}.avif 1x, ${pfad}@2x.avif 2x`}
			/>
			<source
				type="image/webp"
				srcSet={`${pfad}.webp 1x, ${pfad}@2x.webp 2x`}
			/>
			<img
				src={`${pfad}.webp`}
				width={breite}
				height={hoehe}
				alt={alt}
				loading={vorrang ? "eager" : "lazy"}
				fetchPriority={vorrang ? "high" : "auto"}
				decoding="async"
				className={klasse}
			/>
		</picture>
	);
}
