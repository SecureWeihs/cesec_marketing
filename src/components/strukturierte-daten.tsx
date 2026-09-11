/**
 * Gibt strukturierte Daten als JSON-LD aus.
 *
 * Das ist ein Inline-Skript und braucht deshalb die Freigabe der
 * Content-Security-Policy. Sie entsteht zur Bauzeit als Hash über genau
 * diesen Inhalt (scripts/csp-hashes.mjs) — der Baum muss dafür bei jedem
 * Build identisch sein, weshalb hier nichts Zufälliges oder Zeitabhängiges
 * hineingehört.
 */
export function StrukturierteDaten({ daten }: { daten: Record<string, unknown> }) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(daten) }}
		/>
	);
}
