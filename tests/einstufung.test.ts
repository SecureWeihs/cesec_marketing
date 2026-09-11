/**
 * Tests der Einstufungsregeln. Jeder Fall nennt die Bestimmung, die er prüft.
 * Aufruf: npm test
 */
import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { einstufen, moeglicheGroessen, pflichten, type Antworten } from "../src/lib/einstufung.ts";

const basis: Antworten = {
	sonderart: "keine",
	anlage: 1,
	finanzsektor: false,
	hauptniederlassungsregel: false,
	mitarbeiter: "ab-250",
	umsatz: "unklar",
	bilanz: "unklar",
	gruppe: "nein",
	niederlassung: "oesterreich",
};
const mit = (aenderung: Partial<Antworten>): Antworten => ({ ...basis, ...aenderung });

describe("Unternehmensgröße, § 25", () => {
	it("zumindest 250 Mitarbeiter ist groß (Abs. 2)", () => {
		assert.deepEqual([...moeglicheGroessen("ab-250", "bis-10", "bis-10")], ["gross"]);
	});
	it("Umsatz über 50 und Bilanz über 43 ist groß, auch mit wenigen Mitarbeitern (Abs. 2)", () => {
		assert.deepEqual([...moeglicheGroessen("unter-50", "ueber-50", "ueber-43")], ["gross"]);
	});
	it("Umsatz über 50, aber Bilanz nur über 10: nicht groß, sondern mittel — das Gesetz verlangt beides (Abs. 2 „und“)", () => {
		assert.deepEqual([...moeglicheGroessen("unter-50", "ueber-50", "ueber-10")], ["mittel"]);
	});
	it("50 bis 249 Mitarbeiter ist mittel (Abs. 3)", () => {
		assert.deepEqual([...moeglicheGroessen("50-249", "bis-10", "bis-10")], ["mittel"]);
	});
	it("Umsatz und Bilanz jeweils über 10 ist mittel (Abs. 3)", () => {
		assert.deepEqual([...moeglicheGroessen("unter-50", "ueber-10", "ueber-10")], ["mittel"]);
	});
	it("nur ein Finanzwert über der Schwelle genügt nicht (Abs. 3 „und“)", () => {
		assert.deepEqual([...moeglicheGroessen("unter-50", "ueber-10", "bis-10")], ["klein"]);
	});
	it("unbekannte Werte liefern alle vereinbaren Größen", () => {
		assert.deepEqual([...moeglicheGroessen("50-249", "unklar", "unklar")].sort(), ["gross", "mittel"]);
	});
});

describe("Einstufung nach Anlage und Größe, § 24", () => {
	it("Anlage 1, groß: wesentlich (Abs. 1 Z 3)", () => {
		assert.equal(einstufen(mit({})).einstufung, "wesentlich");
	});
	it("Anlage 1, mittel: wichtig (Abs. 2 Z 1)", () => {
		assert.equal(einstufen(mit({ mitarbeiter: "50-249", umsatz: "bis-10", bilanz: "bis-10" })).einstufung, "wichtig");
	});
	it("Anlage 2, groß: wichtig, nicht wesentlich (Abs. 2 Z 1)", () => {
		assert.equal(einstufen(mit({ anlage: 2 })).einstufung, "wichtig");
	});
	it("Anlage 2, klein: nicht erfasst, mit Hinweis auf § 26", () => {
		const e = einstufen(mit({ anlage: 2, mitarbeiter: "unter-50", umsatz: "bis-10", bilanz: "bis-10" }));
		assert.equal(e.einstufung, "nicht-erfasst");
		assert.ok(e.hinweise.some((h) => h.includes("§ 26")));
	});
	it("kein Sektor: nicht erfasst", () => {
		assert.equal(einstufen(mit({ anlage: null })).einstufung, "nicht-erfasst");
	});
	it("Anlage 1, Größe zwischen mittel und groß unklar: Einzelfallprüfung", () => {
		assert.equal(einstufen(mit({ mitarbeiter: "50-249", umsatz: "unklar", bilanz: "unklar" })).einstufung, "einzelfall");
	});
	it("Anlage 2, Größe zwischen mittel und groß unklar: trotzdem eindeutig wichtig", () => {
		assert.equal(einstufen(mit({ anlage: 2, mitarbeiter: "50-249", umsatz: "unklar", bilanz: "unklar" })).einstufung, "wichtig");
	});
});

describe("Größenunabhängige Sonderregeln, § 24", () => {
	it("DNS-Diensteanbieter, klein: wesentlich (Abs. 1 Z 1 lit. c)", () => {
		assert.equal(einstufen(mit({ sonderart: "dns-dienst", mitarbeiter: "unter-50", umsatz: "bis-10", bilanz: "bis-10" })).einstufung, "wesentlich");
	});
	it("Kommunikationsanbieter, klein: wichtig (Abs. 2 Z 3 lit. a)", () => {
		assert.equal(einstufen(mit({ sonderart: "kommunikation", mitarbeiter: "unter-50", umsatz: "bis-10", bilanz: "bis-10" })).einstufung, "wichtig");
	});
	it("Kommunikationsanbieter, mittel: wesentlich (Abs. 1 Z 2)", () => {
		assert.equal(einstufen(mit({ sonderart: "kommunikation", mitarbeiter: "50-249", umsatz: "bis-10", bilanz: "bis-10" })).einstufung, "wesentlich");
	});
	it("nicht qualifizierter Vertrauensdiensteanbieter, klein: wichtig (Abs. 2 Z 3 lit. b)", () => {
		assert.equal(einstufen(mit({ sonderart: "vertrauensdienst", mitarbeiter: "unter-50", umsatz: "bis-10", bilanz: "bis-10" })).einstufung, "wichtig");
	});
	it("Landesverwaltung: wichtig (Abs. 2 Z 2)", () => {
		assert.equal(einstufen(mit({ sonderart: "landesverwaltung", anlage: 1 })).einstufung, "wichtig");
	});
	it("Sonderart unklar: Einzelfallprüfung", () => {
		assert.equal(einstufen(mit({ sonderart: "unklar" })).einstufung, "einzelfall");
	});
});

describe("Territorialität, § 28", () => {
	it("Niederlassung nur in einem anderen Mitgliedstaat: nicht erfasst (Abs. 1)", () => {
		assert.equal(einstufen(mit({ niederlassung: "andere-eu" })).einstufung, "nicht-erfasst");
	});
	it("außerhalb der EU: Einzelfallprüfung", () => {
		assert.equal(einstufen(mit({ niederlassung: "ausserhalb-eu" })).einstufung, "einzelfall");
	});
	it("Bundesverwaltung unabhängig vom Niederlassungsort (Abs. 2 Z 3)", () => {
		assert.equal(einstufen(mit({ sonderart: "bundesverwaltung", niederlassung: "andere-eu" })).einstufung, "wesentlich");
	});
	it("Kommunikationsanbieter ohne österreichische Niederlassung: Einzelfall (Abs. 2 Z 1)", () => {
		assert.equal(einstufen(mit({ sonderart: "kommunikation", niederlassung: "andere-eu" })).einstufung, "einzelfall");
	});
});

describe("Konzern, § 25 Abs. 4, und Finanzsektor, § 27", () => {
	it("Konzernzugehörigkeit mit unklarer IT-Unabhängigkeit: Einzelfallprüfung", () => {
		assert.equal(einstufen(mit({ gruppe: "ja-unklar" })).einstufung, "einzelfall");
	});
	it("Konzernzugehörigkeit bekannt: Einstufung mit Hinweis", () => {
		const e = einstufen(mit({ gruppe: "ja" }));
		assert.equal(e.einstufung, "wesentlich");
		assert.ok(e.hinweise.some((h) => h.includes("§ 25 Abs. 4")));
	});
	it("Finanzsektor: Hinweis auf § 27, Registrierung bleibt", () => {
		const e = einstufen(mit({ finanzsektor: true }));
		assert.ok(e.hinweise.some((h) => h.includes("§ 27") && h.includes("§ 29")));
	});
});

describe("Folgepflichten", () => {
	it("wesentlich: zwei Monate für den Nachweis und Aufsicht nach § 38 Abs. 1", () => {
		const p = pflichten("wesentlich").join(" ");
		assert.ok(p.includes("zwei Monaten") && p.includes("§ 38 Abs. 1"));
	});
	it("wichtig: zwei Jahre und Aufsicht nach § 38 Abs. 2", () => {
		const p = pflichten("wichtig").join(" ");
		assert.ok(p.includes("zwei Jahren") && p.includes("§ 38 Abs. 2"));
	});
	it("nicht erfasst: keine Pflichten", () => {
		assert.deepEqual(pflichten("nicht-erfasst"), []);
	});
});
