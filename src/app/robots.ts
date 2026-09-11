import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Abschnitt 9.1: alles erlaubt außer /api/, KI-Crawler ausdrücklich zugelassen.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
		sitemap: `${site.url}/sitemap.xml`,
		host: site.url,
	};
}
