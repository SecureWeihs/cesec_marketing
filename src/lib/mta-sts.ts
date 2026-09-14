/**
 * MTA-STS (RFC 8461) und TLS-RPT (RFC 8460).
 *
 * Wozu: Die Verschlüsselung zwischen Mailservern ist von Haus aus
 * „opportunistisch“. Bietet die Gegenstelle kein STARTTLS an, stellt der
 * absendende Server trotzdem zu — im Klartext. Ein Angreifer im
 * Übertragungsweg muss also nur das TLS-Angebot aus der Verbindung streichen.
 * MTA-STS erklärt verbindlich, dass Post an diese Domain ausschließlich über
 * TLS mit gültigem Zertifikat und nur an die hier genannten MX-Hosts
 * angenommen wird.
 *
 * Warum über HTTPS und nicht im DNS: Ohne DNSSEC sind DNS-Antworten fälschbar.
 * Das Zertifikat von mta-sts.cesec.at liefert den Vertrauensanker, den das DNS
 * hier nicht liefern kann. Genau deshalb ist MTA-STS der Mechanismus für
 * Domains ohne DNSSEC; das DNSSEC-gestützte Gegenstück wäre DANE (TLSA).
 *
 * Diese Datei ist die einzige Quelle der Wahrheit: Aus ihr entstehen die
 * ausgelieferte Richtliniendatei (src/proxy.ts), die erwarteten DNS-Zeilen und
 * die Live-Prüfung (scripts/pruefe-mail.mjs).
 *
 * Hinweis zur Nennung des Anbieters: Die Richtlinie muss die MX-Hosts im
 * Klartext nennen, das schreibt RFC 8461 so vor. Ein Geheimnis gibt sie nicht
 * preis — dieselben Namen stehen in den öffentlichen MX-Einträgen der Domain
 * und sind mit einer einzigen DNS-Abfrage sichtbar.
 */

/** Host, unter dem die Richtliniendatei liegen muss (RFC 8461, Abschnitt 3.3). */
export const MTA_STS_HOST = "mta-sts.cesec.at";

/** Pfad der Richtliniendatei. Durch RFC 8461 fest vorgegeben. */
export const MTA_STS_PFAD = "/.well-known/mta-sts.txt";

/** Domain, für die die Richtlinie gilt. */
export const DOMAIN = "cesec.at";

/**
 * Die MX-Hosts, an die zugestellt werden darf. Müssen mit den MX-Einträgen im
 * DNS übereinstimmen, sonst lehnen absendende Server die Zustellung ab.
 * Geprüft gegen das Live-DNS in scripts/pruefe-mail.mjs.
 */
export const MX_HOSTS = ["mx1.startmail.com", "mx2.startmail.com"] as const;

/**
 * "testing" meldet Verstöße über TLS-RPT, stellt aber weiter zu.
 * "enforce" bricht die Zustellung ab, statt unverschlüsselt zu senden.
 *
 * Bewusst auf "testing": Eine fehlerhafte Richtlinie im Modus "enforce"
 * blockiert eingehende Post, ohne dass der Absender eine Rückmeldung an uns
 * schickt. Erst nach einigen Wochen ausgewerteter TLS-RPT-Berichte auf
 * "enforce" umstellen — dann KENNUNG erhöhen und den TXT-Eintrag anpassen.
 */
export const MODUS: "testing" | "enforce" | "none" = "testing";

/**
 * Wie lange absendende Server die Richtlinie zwischenspeichern, in Sekunden.
 * Eine Woche. RFC 8461 erlaubt höchstens 31557600 (ein Jahr) und empfiehlt
 * einen hohen Wert, weil die zwischengespeicherte Richtlinie den Schutz auch
 * dann trägt, wenn ein Angreifer den Abruf der neuen Richtlinie stört.
 */
export const MAX_AGE = 604800;

/**
 * Änderungsstempel für den TXT-Eintrag `_mta-sts`. Absendende Server holen die
 * Richtliniendatei nur dann neu, wenn sich dieser Wert ändert. Bei JEDER
 * Änderung an Modus, MX-Liste oder Gültigkeitsdauer erhöhen.
 * Höchstens 32 alphanumerische Zeichen (RFC 8461, Abschnitt 3.1).
 */
export const KENNUNG = "20260914a";

/** Postfach für die TLS-RPT-Berichte. */
export const BERICHTSADRESSE = "report@cesec.at";

/**
 * Die Richtliniendatei nach RFC 8461, Abschnitt 3.2.
 * Zeilen werden mit CRLF getrennt, so wie es die Grammatik des RFC vorsieht.
 */
export function richtlinie(): string {
	const zeilen = [
		"version: STSv1",
		`mode: ${MODUS}`,
		...MX_HOSTS.map((mx) => `mx: ${mx}`),
		`max_age: ${MAX_AGE}`,
	];
	return `${zeilen.join("\r\n")}\r\n`;
}

/** Inhalt des TXT-Eintrags auf `_mta-sts.cesec.at`. */
export function txtEintragMtaSts(): string {
	return `v=STSv1; id=${KENNUNG}`;
}

/** Inhalt des TXT-Eintrags auf `_smtp._tls.cesec.at`. */
export function txtEintragTlsRpt(): string {
	return `v=TLSRPTv1; rua=mailto:${BERICHTSADRESSE}`;
}
