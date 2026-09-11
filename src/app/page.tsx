import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Externer Informationssicherheitsbeauftragter in Österreich",
	description:
		"Externer Informationssicherheitsbeauftragter für Unternehmen, die das NISG 2026 oder ISO 27001 erfüllen müssen. Von der CIS berufen, Aufsichtserfahrung aus der Bankenprüfung.",
};

export default function Startseite() {
	return (
		<div className="mx-auto max-w-5xl px-5 py-16">
			<h1 className="max-w-[20ch] text-4xl sm:text-5xl">
				Externer Informationssicherheitsbeauftragter für Unternehmen, die
				NISG 2026 oder ISO 27001 erfüllen müssen.
			</h1>
			<p className="mt-6 max-w-satz text-stahl">
				Diese Seite ist das Gerüst aus Schritt 1. Die Inhalte folgen in den
				Schritten 4 bis 7 des Projekt-Briefs.
			</p>
		</div>
	);
}
