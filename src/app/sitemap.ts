import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Ab Schritt 7 wird diese Liste aus dem Verzeichnis content/ erzeugt und
 * lastModified aus dem Frontmatter-Feld dateModified übernommen übernommen.
 * Solange nur das Gerüst steht, wird ausschließlich die Startseite geführt.
 */
const SEITEN = [
	{ pfad: "/", prioritaet: 1 },
	{ pfad: "/about", prioritaet: 0.8 },
	{ pfad: "/kontakt", prioritaet: 0.7 },
	{ pfad: "/impressum", prioritaet: 0.3 },
	{ pfad: "/datenschutz", prioritaet: 0.3 },
	{ pfad: "/barrierefreiheit", prioritaet: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
	return SEITEN.map((seite) => ({
		url: `${site.url}${seite.pfad === "/" ? "" : seite.pfad}`,
		lastModified: new Date("2026-09-11"),
		changeFrequency: "yearly" as const,
		priority: seite.prioritaet,
	}));
}
