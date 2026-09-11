import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Ab Schritt 7 wird diese Liste aus dem Verzeichnis content/ erzeugt und
 * lastModified aus dem Frontmatter-Feld dateModified übernommen übernommen.
 * Solange nur das Gerüst steht, wird ausschließlich die Startseite geführt.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: site.url,
			lastModified: new Date("2026-09-11"),
			changeFrequency: "yearly",
			priority: 1,
		},
	];
}
