import { logo } from "@/lib/logo";

/**
 * Die Bildmarke, inline eingebunden: kein zusätzlicher Abruf, und die Farbe
 * folgt dem Textfluss, sodass dieselbe Marke auf hellem wie auf dunklem Grund
 * funktioniert.
 */
export function Logo({
	klasse,
	titel = "Cesec",
}: {
	klasse?: string;
	titel?: string;
}) {
	return (
		<svg
			viewBox={`0 0 ${logo.breite} ${logo.hoehe}`}
			role="img"
			aria-label={titel}
			className={klasse}
			fill="currentColor"
		>
			<path fillRule="evenodd" d={logo.pfad} />
		</svg>
	);
}
