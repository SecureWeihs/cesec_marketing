/**
 * Meldet Leitfäden, deren letzte Änderung mehr als zwölf Monate zurückliegt
 * (Abschnitt 9.5 des Briefs: „Seiten älter als zwölf Monate werden im Build
 * zur Überprüfung markiert“). Bricht den Build nicht ab — ein alter Leitfaden
 * kann richtig sein. Er soll nur gelesen werden, bevor er es weiter ist.
 *
 * Läuft einmal je Build, nicht in jedem Arbeitsprozess von Next.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";

const VERZEICHNIS = "content/leitfaeden";
const grenze = new Date();
grenze.setFullYear(grenze.getFullYear() - 1);

const faellig = [];
for (const name of (await readdir(VERZEICHNIS)).filter((n) => n.endsWith(".mdx"))) {
	const roh = await readFile(join(VERZEICHNIS, name), "utf8");
	const kopf = /^---\r?\n([\s\S]*?)\r?\n---/.exec(roh)?.[1];
	if (!kopf) continue;
	const { dateModified, title } = parse(kopf);
	if (dateModified && new Date(dateModified) < grenze) faellig.push({ name, title, dateModified });
}

if (faellig.length > 0) {
	console.warn("Leitfäden zur Überprüfung (letzte Änderung vor mehr als zwölf Monaten):");
	for (const l of faellig) console.warn(`  • ${l.name} — ${l.title} — zuletzt geändert ${l.dateModified}`);
} else {
	console.log("Leitfäden: alle innerhalb der letzten zwölf Monate geprüft.");
}
