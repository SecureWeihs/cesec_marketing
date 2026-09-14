/**
 * Tests der MTA-STS-Richtlinie gegen die Formatvorgaben aus RFC 8461.
 * Eine formal falsche Richtlinie wird von absendenden Servern verworfen —
 * im Modus "enforce" bleibt dann Post aus, ohne Fehlermeldung an uns.
 * Aufruf: npm test
 */
import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import {
	KENNUNG,
	MAX_AGE,
	MODUS,
	MTA_STS_HOST,
	MTA_STS_PFAD,
	MX_HOSTS,
	richtlinie,
	txtEintragMtaSts,
	txtEintragTlsRpt,
} from "../src/lib/mta-sts.ts";

describe("Richtliniendatei, RFC 8461 Abschnitt 3.2", () => {
	it("beginnt mit der Version, sonst wird die Datei verworfen", () => {
		assert.equal(richtlinie().split("\r\n")[0], "version: STSv1");
	});

	it("trennt Zeilen mit CRLF, wie es die Grammatik verlangt", () => {
		const text = richtlinie();
		assert.match(text, /\r\n$/);
		assert.equal(text.includes("\n\n"), false);
		for (const zeile of text.split("\r\n")) {
			assert.equal(zeile.includes("\n"), false, "kein nacktes LF");
		}
	});

	it("nennt jeden MX-Host in einer eigenen Zeile", () => {
		const zeilen = richtlinie().trimEnd().split("\r\n");
		const mx = zeilen.filter((z) => z.startsWith("mx: ")).map((z) => z.slice(4));
		assert.deepEqual(mx, [...MX_HOSTS]);
		assert.ok(mx.length > 0, "ohne MX-Host ist die Richtlinie wertlos");
	});

	it("nennt MX-Hosts klein geschrieben und ohne Punkt am Ende", () => {
		for (const mx of MX_HOSTS) {
			assert.equal(mx, mx.toLowerCase());
			assert.equal(mx.endsWith("."), false, "kein abschließender Punkt");
			assert.match(mx, /^[a-z0-9.-]+\.[a-z]{2,}$/);
		}
	});

	it("setzt einen zulässigen Modus", () => {
		assert.ok(["testing", "enforce", "none"].includes(MODUS));
		assert.ok(richtlinie().includes(`mode: ${MODUS}`));
	});

	it("hält max_age im erlaubten Bereich (höchstens ein Jahr)", () => {
		assert.ok(Number.isInteger(MAX_AGE));
		assert.ok(MAX_AGE > 0);
		assert.ok(MAX_AGE <= 31557600);
		assert.ok(richtlinie().includes(`max_age: ${MAX_AGE}`));
	});

	it("enthält keine überflüssigen Leerzeichen am Zeilenende", () => {
		for (const zeile of richtlinie().split("\r\n")) {
			assert.equal(zeile, zeile.trimEnd());
		}
	});
});

describe("DNS-Einträge", () => {
	it("die Kennung ist alphanumerisch und höchstens 32 Zeichen (Abschnitt 3.1)", () => {
		assert.match(KENNUNG, /^[A-Za-z0-9]{1,32}$/);
	});

	it("der TXT-Eintrag nennt Version und Kennung", () => {
		assert.equal(txtEintragMtaSts(), `v=STSv1; id=${KENNUNG}`);
	});

	it("der TLS-RPT-Eintrag nennt ein Postfach für die Berichte", () => {
		assert.match(txtEintragTlsRpt(), /^v=TLSRPTv1; rua=mailto:[^@\s]+@[^@\s]+$/);
	});
});

describe("Ablageort", () => {
	it("liegt unter dem vorgeschriebenen Host und Pfad", () => {
		assert.equal(MTA_STS_HOST, "mta-sts.cesec.at");
		assert.equal(MTA_STS_PFAD, "/.well-known/mta-sts.txt");
	});
});
