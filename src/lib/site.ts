import { impressum } from "@/lib/impressum";

/**
 * Abgeleitet aus content/impressum.yaml. Keine eigenen Werte, damit
 * Impressum, NAP.md, strukturierte Daten und Seitenlayout nicht auseinander-
 * laufen können.
 *
 * Liest beim Bauen eine Datei und gehört deshalb in Server-Komponenten.
 * Was eine Client-Komponente braucht, bekommt sie als Eigenschaft übergeben;
 * die Navigationsdaten stehen in src/lib/navigation.ts.
 */
export const site = {
	name: impressum.firmenwortlaut,
	inhaber: impressum.inhaber,
	url: impressum.website,
	sprache: "de-AT",
	telefon: impressum.telefon,
	email: impressum.email,
	anschrift: impressum.anschrift,
	linkedin: impressum.profile.linkedin,
} as const;
