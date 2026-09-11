import { analyse } from "@/lib/analyse";

/**
 * Bindet den Umami-Tracker ein, sofern die Messung eingeschaltet ist.
 * Ein reguläres Skript vom eigenen Origin, kein Inline-Code: Die CSP erlaubt
 * es über 'self', ohne Hash und ohne zusätzlichen Host.
 *
 * Attribute nach der Umami-Dokumentation (Tracker configuration):
 * data-host-url   Messpunkte ebenfalls über den eigenen Origin
 * data-do-not-track  „Do Not Track“ des Browsers wird respektiert
 * data-exclude-search, data-exclude-hash  keine Suchparameter, keine Anker
 * data-domains    nur auf der Produktionsdomain, nicht auf Vorschauen
 */
export function AnalyseSkript() {
	if (!analyse.aktiv) return null;
	return (
		<script
			defer
			src={`${analyse.pfad}/script.js`}
			data-website-id={analyse.websiteId}
			data-host-url={analyse.pfad}
			data-do-not-track="true"
			data-exclude-search="true"
			data-exclude-hash="true"
			data-domains="cesec.at"
		/>
	);
}
