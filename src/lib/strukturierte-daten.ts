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

/**
 * Die Person hinter dem Unternehmen, für /about.
 *
 * Jede Angabe stammt aus dem Beraterprofil des Inhabers. Zertifizierungen
 * stehen als hasCredential, damit sie maschinenlesbar und überprüfbar sind —
 * das ist bei einem Einzelunternehmen der Ersatz für Kundenlogos.
 */
export function person(): Knoten {
	return {
		"@context": "https://schema.org",
		"@type": "Person",
		"@id": `${site.url}/about#person`,
		name: "Sascha Weihs",
		honorificPrefix: "Dipl.-Ing.",
		jobTitle: "Informationssicherheitsbeauftragter",
		url: `${site.url}/about`,
		image: `${site.url}/bilder/portraet-about@2x.webp`,
		email: site.email,
		telephone: site.telefon.e164,
		worksFor: { "@id": `${site.url}/#unternehmen` },
		alumniOf: {
			"@type": "CollegeOrUniversity",
			name: "FH St. Pölten",
		},
		hasCredential: [
			{
				"@type": "EducationalOccupationalCredential",
				name: "Information Security Auditor",
				credentialCategory: "Personenzertifizierung nach EN ISO/IEC 17024",
				recognizedBy: { "@type": "Organization", name: "CIS" },
			},
			{
				"@type": "EducationalOccupationalCredential",
				name: "Information Security Manager",
				credentialCategory: "Personenzertifizierung nach EN ISO/IEC 17024",
				recognizedBy: { "@type": "Organization", name: "CIS" },
			},
			{
				"@type": "EducationalOccupationalCredential",
				name: "Dipl.-Ing., Informatik & Security",
				credentialCategory: "Akademischer Grad",
				recognizedBy: { "@type": "CollegeOrUniversity", name: "FH St. Pölten" },
			},
		],
		knowsAbout: [
			"ISO/IEC 27001",
			"ISO/IEC 27005",
			"ISO 22301",
			"NIS2",
			"NISG 2026",
			"DORA",
			"IKT-Risikomanagement",
			"Business Continuity Management",
			"Interne Audits",
		],
		knowsLanguage: ["de", "en"],
		sameAs: [impressum.profile.linkedin],
	};
}
