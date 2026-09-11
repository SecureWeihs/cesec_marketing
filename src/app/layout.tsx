import type { Metadata, Viewport } from "next";
import { site } from "@/lib/site";
import { Kopfzeile } from "@/components/kopfzeile";
import { Fusszeile } from "@/components/fusszeile";
import "./globals.css";

export const metadata: Metadata = {
	metadataBase: new URL(site.url),
	title: {
		default: "Externer Informationssicherheitsbeauftragter | Cesec",
		template: "%s | Cesec",
	},
	description:
		"Externer Informationssicherheitsbeauftragter für Unternehmen, die das NISG 2026 oder ISO 27001 erfüllen müssen. Aufsichtserfahrung aus Bank und Prüfung.",
	authors: [{ name: site.inhaber, url: `${site.url}/about` }],
	robots: { index: true, follow: true },
};

export const viewport: Viewport = {
	themeColor: "#fdfdfb",
	colorScheme: "light",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="de-AT">
			<body className="flex min-h-screen flex-col">
				<a
					href="#inhalt"
					className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-signal focus:px-4 focus:py-2 focus:text-papier"
				>
					Zum Inhalt springen
				</a>
				<Kopfzeile />
				<main id="inhalt" className="flex-1">
					{children}
				</main>
				<Fusszeile />
			</body>
		</html>
	);
}
