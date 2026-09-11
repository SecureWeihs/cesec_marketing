import { logo } from "@/lib/logo";

/**
 * Die Bildmarke, inline eingebunden: kein zusätzlicher Abruf, und die Farbe
 * folgt dem Textfluss, sodass dieselbe Marke auf hellem wie auf dunklem Grund
 * funktioniert.
 *
 * `dekorativ` gilt, wenn daneben ohnehin „Cesec“ als Text steht. Dann wird die
 * Grafik für Screenreader ausgeblendet, statt den Namen ein zweites Mal
 * vorzulesen. Ein leeres aria-label wäre dafür der falsche Weg: eine Grafik mit
 * der Rolle „img“ und ohne Textalternative ist ein Verstoß gegen WCAG.
 */
export function Logo({
	klasse,
	titel = "Cesec",
	dekorativ = false,
}: {
	klasse?: string;
	titel?: string;
	dekorativ?: boolean;
}) {
	const beschriftung = dekorativ
		? { "aria-hidden": true, focusable: false }
		: { role: "img", "aria-label": titel };

	return (
		<svg
			viewBox={`0 0 ${logo.breite} ${logo.hoehe}`}
			className={klasse}
			fill="currentColor"
			{...beschriftung}
		>
			<path fillRule="evenodd" d={logo.pfad} />
		</svg>
	);
}
