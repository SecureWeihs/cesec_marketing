import type { MetadataRoute } from "next";
import { leitfaeden } from "@/lib/leitfaeden";
import { site } from "@/lib/site";

/**
 * Feste Seiten mit dem Datum ihrer letzten inhaltlichen Änderung, Leitfäden
 * aus content/leitfaeden mit lastModified aus dateModified (Abschnitt 9.1).
 */
const SEITEN = [
	{ pfad: "/", prioritaet: 1, geaendert: "2026-09-11" },
	{ pfad: "/nis2-nisg-2026", prioritaet: 1, geaendert: "2026-09-11" },
	{ pfad: "/nis2-nisg-2026/betroffenheit-pruefen", prioritaet: 0.9, geaendert: "2026-09-11" },
	{ pfad: "/iso-27001", prioritaet: 0.9, geaendert: "2026-09-11" },
	{ pfad: "/security-services", prioritaet: 0.8, geaendert: "2026-09-11" },
	{ pfad: "/referenzen", prioritaet: 0.6, geaendert: "2026-09-11" },
	{ pfad: "/about", prioritaet: 0.8, geaendert: "2026-09-11" },
	{ pfad: "/kontakt", prioritaet: 0.7, geaendert: "2026-09-11" },
	{ pfad: "/impressum", prioritaet: 0.3, geaendert: "2026-09-11" },
	{ pfad: "/datenschutz", prioritaet: 0.3, geaendert: "2026-09-11" },
	{ pfad: "/barrierefreiheit", prioritaet: 0.3, geaendert: "2026-09-11" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		...SEITEN.map((seite) => ({
			url: `${site.url}${seite.pfad === "/" ? "" : seite.pfad}`,
			lastModified: new Date(seite.geaendert),
			changeFrequency: "yearly" as const,
			priority: seite.prioritaet,
		})),
		...leitfaeden.map((l) => ({
			url: `${site.url}${l.pfad}`,
			lastModified: new Date(l.dateModified),
			changeFrequency: "yearly" as const,
			priority: 0.8,
		})),
	];
}
