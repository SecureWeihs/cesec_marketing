import { impressum } from "@/lib/impressum";
import { site } from "@/lib/site";

/**
 * Strukturierte Daten nach schema.org.
 *
 * Zwei Regeln, die hier durchgehalten werden:
 * Erstens keine Preisangabe — kein priceRange, kein offers mit Betrag.
 * Zweitens keine Bewertung ohne echte Bewertungen, also kein AggregateRating.
 * Beides würde Google als Anlass für Bewertungssterne nehmen, die es nicht gibt.
 */

type Knoten = Record<string, unknown>;

/** Profile, die das Unternehmen belegen. Offene Einträge fallen weg. */
function sameAs(): string[] {
	return [impressum.profile.linkedin, impressum.profile.googleUnternehmensprofil].filter(
		(eintrag): eintrag is string => typeof eintrag === "string",
	);
}

export function postanschrift(): Knoten {
	return {
		"@type": "PostalAddress",
		streetAddress: impressum.anschrift.strasse,
		postalCode: impressum.anschrift.plz,
		addressLocality: impressum.anschrift.ort,
		addressCountry: impressum.anschrift.landCode,
	};
}

/** Das Unternehmen. Steht auf jeder Seite, immer unter derselben Kennung. */
export function unternehmen(): Knoten {
	return {
		"@context": "https://schema.org",
		"@type": "ProfessionalService",
		"@id": `${site.url}/#unternehmen`,
		name: impressum.firmenwortlaut,
		url: site.url,
		email: site.email,
		telephone: site.telefon.e164,
		address: postanschrift(),
		founder: { "@id": `${site.url}/about#person` },
		areaServed: ["Wien", "Niederösterreich", "Österreich"].map((name) => ({
			"@type": "AdministrativeArea",
			name,
		})),
		knowsAbout: [
			"ISO/IEC 27001",
			"NIS2",
			"NISG 2026",
			"Informationssicherheits-Managementsystem",
			"IKT-Risikomanagement",
			"Business Continuity Management",
		],
		sameAs: sameAs(),
	};
}

export function brotkrumen(
	stufen: readonly { titel: string; pfad: string }[],
): Knoten {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: stufen.map((stufe, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: stufe.titel,
			item: `${site.url}${stufe.pfad === "/" ? "" : stufe.pfad}`,
		})),
	};
}
