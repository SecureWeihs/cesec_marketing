"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import {
	einstufen,
	pflichten,
	type Antworten,
	type Bilanz,
	type Ergebnis,
	type Gruppe,
	type Mitarbeiter,
	type Niederlassung,
	type Sonderart,
	type Umsatz,
} from "@/lib/einstufung";
import { fristen } from "@/lib/fristen";
import { sektoren } from "@/lib/sektoren";

/*
 * Der Selbstcheck läuft vollständig im Browser. Kein Abruf, kein Cookie,
 * kein localStorage, kein Formularversand: Die Antworten liegen nur im
 * Arbeitsspeicher dieser Seite und sind beim Schließen weg.
 * Ohne JavaScript bleibt die statische Erklärung auf der Seite lesbar; dieser
 * Teil erscheint erst, wenn das Skript geladen ist.
 */

type Entwurf = {
	sektor: string;
	sonderart: Sonderart | "";
	mitarbeiter: Mitarbeiter | "";
	umsatz: Umsatz | "";
	bilanz: Bilanz | "";
	gruppe: Gruppe | "";
	niederlassung: Niederlassung | "";
};

const LEER: Entwurf = {
	sektor: "",
	sonderart: "",
	mitarbeiter: "",
	umsatz: "",
	bilanz: "",
	gruppe: "",
	niederlassung: "",
};

/** Sektoren, in denen die Hauptniederlassung zählt (§ 28 Abs. 2 Z 2). */
const HAUPTNIEDERLASSUNG = new Set(["digitale-infrastruktur", "ikt-dienste-b2b", "digitale-dienste"]);
const FINANZ = new Set(["bankwesen", "finanzmarktinfrastrukturen"]);

type Option<T extends string> = { wert: T; text: string };

const SONDERARTEN: Option<Sonderart>[] = [
	{ wert: "keine", text: "Nein, nichts davon" },
	{ wert: "kommunikation", text: "Anbieter öffentlicher elektronischer Kommunikationsnetze oder -dienste" },
	{ wert: "qualifizierter-vertrauensdienst", text: "Qualifizierter Vertrauensdiensteanbieter" },
	{ wert: "vertrauensdienst", text: "Vertrauensdiensteanbieter (nicht qualifiziert)" },
	{ wert: "dns-dienst", text: "DNS-Diensteanbieter (außer Root-Nameserver)" },
	{ wert: "tld-namenregister", text: "Namenregister einer Domäne oberster Stufe (TLD)" },
	{ wert: "bundesverwaltung", text: "Einrichtung der öffentlichen Verwaltung des Bundes" },
	{ wert: "landesverwaltung", text: "Einrichtung der öffentlichen Verwaltung eines Landes" },
	{ wert: "kritische-einrichtung", text: "Als kritische Einrichtung nach der Richtlinie (EU) 2022/2557 ermittelt" },
	{ wert: "bescheid-wesentlich", text: "Per Bescheid der Cybersicherheitsbehörde als wesentlich eingestuft" },
	{ wert: "bescheid-wichtig", text: "Per Bescheid der Cybersicherheitsbehörde als wichtig eingestuft" },
	{ wert: "unklar", text: "Weiß ich nicht" },
];

const MITARBEITER: Option<Mitarbeiter>[] = [
	{ wert: "unter-50", text: "weniger als 50" },
	{ wert: "50-249", text: "50 bis 249" },
	{ wert: "ab-250", text: "250 oder mehr" },
	{ wert: "unklar", text: "Weiß ich nicht" },
];
// Die Beträge sind die gesetzlichen Schwellen aus § 25 Abs. 2 und 3 NISG 2026.
// Ohne sie ist keine Einstufung möglich; sie sind keine Preisangabe.
const UMSATZ: Option<Umsatz>[] = [
	{ wert: "bis-10", text: "bis 10 Millionen Euro" },
	{ wert: "ueber-10", text: "über 10 bis 50 Millionen Euro" },
	{ wert: "ueber-50", text: "über 50 Millionen Euro" },
	{ wert: "unklar", text: "Weiß ich nicht" },
];
const BILANZ: Option<Bilanz>[] = [
	{ wert: "bis-10", text: "bis 10 Millionen Euro" },
	{ wert: "ueber-10", text: "über 10 bis 43 Millionen Euro" },
	{ wert: "ueber-43", text: "über 43 Millionen Euro" },
	{ wert: "unklar", text: "Weiß ich nicht" },
];
const GRUPPE: Option<Gruppe>[] = [
	{ wert: "nein", text: "Nein, eigenständiges Unternehmen" },
	{ wert: "ja", text: "Ja — die Zahlen oben enthalten die Partner- und verbundenen Unternehmen, oder unsere IT ist nachweislich unabhängig" },
	{ wert: "ja-unklar", text: "Ja, und ich weiß nicht, ob die Konzernzahlen mitzählen" },
];

const TITEL: Record<Ergebnis["einstufung"], string> = {
	wesentlich: "Voraussichtlich wesentliche Einrichtung",
	wichtig: "Voraussichtlich wichtige Einrichtung",
	"nicht-erfasst": "Voraussichtlich nicht erfasst",
	einzelfall: "Unklar — Einzelfallprüfung nötig",
};

function Auswahl<T extends string>({
	name,
	legende,
	hilfe,
	optionen,
	wert,
	aendern,
}: {
	name: string;
	legende: string;
	hilfe?: string;
	optionen: Option<T>[];
	wert: T | "";
	aendern: (neu: T) => void;
}) {
	const hilfeId = useId();
	return (
		<fieldset className="mt-6" aria-describedby={hilfe ? hilfeId : undefined}>
			<legend className="font-medium">{legende}</legend>
			{hilfe && (
				<p id={hilfeId} className="mt-1 text-sm text-stahl">
					{hilfe}
				</p>
			)}
			<div className="mt-3 space-y-2">
				{optionen.map((option) => (
					<label key={option.wert} className="flex cursor-pointer items-start gap-3">
						<input
							type="radio"
							name={name}
							value={option.wert}
							checked={wert === option.wert}
							onChange={() => aendern(option.wert)}
							className="mt-1.5 accent-signal"
						/>
						<span>{option.text}</span>
					</label>
				))}
			</div>
		</fieldset>
	);
}

export function Selbstcheck({ telefon, telefonE164 }: { telefon: string; telefonE164: string }) {
	// Im Browser true, beim Vorrendern false: So bleibt der interaktive Teil im
	// ausgelieferten HTML verborgen und erscheint erst mit dem Skript.
	const bereit = useSyncExternalStore(
		() => () => {},
		() => true,
		() => false,
	);
	const [schritt, setSchritt] = useState(0);
	const [entwurf, setEntwurf] = useState<Entwurf>(LEER);
	const [fehler, setFehler] = useState("");
	const [ergebnis, setErgebnis] = useState<Ergebnis | null>(null);
	const ueberschrift = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		if (bereit) ueberschrift.current?.focus();
	}, [schritt, ergebnis, bereit]);

	const setze = <K extends keyof Entwurf>(feld: K, wert: Entwurf[K]) => {
		setEntwurf((alt) => ({ ...alt, [feld]: wert }));
		setFehler("");
	};

	const schritte = [
		{
			titel: "Tätigkeit",
			pflicht: ["sektor"] as const,
			inhalt: (
				<fieldset className="mt-6">
					<legend className="font-medium">
						In welchem Sektor ist Ihr Unternehmen tätig?
					</legend>
					<p className="mt-1 text-sm text-stahl">
						Maßgeblich ist die tatsächliche Tätigkeit, nicht die Branchenangabe im
						Firmenbuch. Die Anlagen 1 und 2 des Gesetzes legen die Arten von
						Einrichtungen im Detail fest.
					</p>
					<label className="mt-3 block">
						<span className="sr-only">Sektor</span>
						<select
							value={entwurf.sektor}
							onChange={(e) => setze("sektor", e.target.value)}
							className="w-full max-w-lg border border-stahl bg-papier px-3 py-2"
						>
							<option value="">Bitte wählen</option>
							<optgroup label="Anlage 1: Sektoren mit hoher Kritikalität">
								{sektoren.filter((s) => s.anlage === 1).map((s) => (
									<option key={s.id} value={s.id}>{s.name}</option>
								))}
							</optgroup>
							<optgroup label="Anlage 2: Sonstige kritische Sektoren">
								{sektoren.filter((s) => s.anlage === 2).map((s) => (
									<option key={s.id} value={s.id}>{s.name}</option>
								))}
							</optgroup>
							<option value="keiner">Keiner dieser Sektoren</option>
							<option value="unklar">Weiß ich nicht</option>
						</select>
					</label>
				</fieldset>
			),
		},
		{
			titel: "Sonderregeln",
			pflicht: ["sonderart"] as const,
			inhalt: (
				<Auswahl
					name="sonderart"
					legende="Trifft eine dieser Beschreibungen auf Ihr Unternehmen zu?"
					hilfe="Diese Einrichtungen sind unabhängig von ihrer Größe erfasst (§ 24)."
					optionen={SONDERARTEN}
					wert={entwurf.sonderart}
					aendern={(w) => setze("sonderart", w)}
				/>
			),
		},
		{
			titel: "Größe",
			pflicht: ["mitarbeiter", "umsatz", "bilanz"] as const,
			inhalt: (
				<>
					<Auswahl
						name="mitarbeiter"
						legende="Wie viele Mitarbeiter beschäftigt Ihr Unternehmen?"
						hilfe="Gezählt wird nach der KMU-Definition der EU (Empfehlung 2003/361/EG), in Jahresarbeitseinheiten."
						optionen={MITARBEITER}
						wert={entwurf.mitarbeiter}
						aendern={(w) => setze("mitarbeiter", w)}
					/>
					<Auswahl
						name="umsatz"
						legende="Jahresumsatz im letzten abgeschlossenen Geschäftsjahr"
						optionen={UMSATZ}
						wert={entwurf.umsatz}
						aendern={(w) => setze("umsatz", w)}
					/>
					<Auswahl
						name="bilanz"
						legende="Jahresbilanzsumme im letzten abgeschlossenen Geschäftsjahr"
						hilfe="Die Beträge in dieser Frage und der vorigen sind die gesetzlichen Schwellen aus § 25 NISG 2026."
						optionen={BILANZ}
						wert={entwurf.bilanz}
						aendern={(w) => setze("bilanz", w)}
					/>
				</>
			),
		},
		{
			titel: "Konzern",
			pflicht: ["gruppe"] as const,
			inhalt: (
				<Auswahl
					name="gruppe"
					legende="Gehört Ihr Unternehmen zu einer Unternehmensgruppe?"
					hilfe="Zahlen von Partner- und verbundenen Unternehmen zählen grundsätzlich mit — außer Ihre Netz- und Informationssysteme sind organisatorisch, technisch und operativ unabhängig (§ 25 Abs. 4)."
					optionen={GRUPPE}
					wert={entwurf.gruppe}
					aendern={(w) => setze("gruppe", w)}
				/>
			),
		},
		{
			titel: "Niederlassung",
			pflicht: ["niederlassung"] as const,
			inhalt: (
				<Auswahl
					name="niederlassung"
					legende={
						HAUPTNIEDERLASSUNG.has(entwurf.sektor)
							? "Wo liegt Ihre Hauptniederlassung in der EU?"
							: "Hat Ihr Unternehmen eine Niederlassung in Österreich?"
					}
					hilfe={
						HAUPTNIEDERLASSUNG.has(entwurf.sektor)
							? "Für Cloud-, Rechenzentrums- und verwaltete IT-Dienste sowie Online-Plattformen zählt der Mitgliedstaat, in dem die Entscheidungen über die Risikomanagementmaßnahmen vorwiegend getroffen werden (§ 28 Abs. 2 und 3)."
							: "Erfasst sind grundsätzlich Einrichtungen, die in Österreich niedergelassen sind (§ 28 Abs. 1)."
					}
					optionen={[
						{ wert: "oesterreich", text: HAUPTNIEDERLASSUNG.has(entwurf.sektor) ? "In Österreich" : "Ja" },
						{ wert: "andere-eu", text: HAUPTNIEDERLASSUNG.has(entwurf.sektor) ? "In einem anderen EU-Mitgliedstaat" : "Nein, nur in anderen EU-Mitgliedstaaten" },
						{ wert: "ausserhalb-eu", text: "Außerhalb der EU" },
						{ wert: "unklar", text: "Weiß ich nicht" },
					]}
					wert={entwurf.niederlassung}
					aendern={(w) => setze("niederlassung", w)}
				/>
			),
		},
	];

	const aktuell = schritte[schritt];

	function weiter() {
		if (!aktuell) return;
		const offen = aktuell.pflicht.filter((feld) => entwurf[feld] === "");
		if (offen.length > 0) {
			setFehler(
				offen.length === 1
					? "Bitte beantworten Sie die Frage, bevor Sie weitergehen."
					: "Bitte beantworten Sie alle Fragen dieses Schritts.",
			);
			return;
		}
		if (schritt < schritte.length - 1) {
			setSchritt(schritt + 1);
			return;
		}
		const sektor = sektoren.find((s) => s.id === entwurf.sektor);
		const antworten: Antworten = {
			sonderart: entwurf.sonderart as Sonderart,
			anlage: entwurf.sektor === "unklar" ? "unklar" : sektor ? sektor.anlage : null,
			finanzsektor: FINANZ.has(entwurf.sektor),
			hauptniederlassungsregel: HAUPTNIEDERLASSUNG.has(entwurf.sektor),
			mitarbeiter: entwurf.mitarbeiter as Mitarbeiter,
			umsatz: entwurf.umsatz as Umsatz,
			bilanz: entwurf.bilanz as Bilanz,
			gruppe: entwurf.gruppe as Gruppe,
			niederlassung: entwurf.niederlassung as Niederlassung,
		};
		setErgebnis(einstufen(antworten));
	}

	function neuBeginnen() {
		setEntwurf(LEER);
		setErgebnis(null);
		setSchritt(0);
		setFehler("");
	}

	return (
		<section aria-labelledby="selbstcheck-titel" hidden={!bereit} className="mt-10 border border-linie bg-flaeche p-5 sm:p-8">
			<p className="nicht-drucken text-sm text-stahl">
				Ihre Eingaben verlassen Ihren Browser nicht. Es wird nichts gespeichert und
				nichts übertragen.
			</p>

			<div aria-live="polite" className="sr-only">
				{ergebnis ? `Ergebnis: ${TITEL[ergebnis.einstufung]}` : aktuell ? `Schritt ${schritt + 1} von ${schritte.length}: ${aktuell.titel}` : ""}
			</div>

			{!ergebnis && aktuell && (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						weiter();
					}}
					noValidate
				>
					<p className="mt-4 text-sm text-stahl">
						Schritt {schritt + 1} von {schritte.length}
					</p>
					<h2 id="selbstcheck-titel" ref={ueberschrift} tabIndex={-1} className="mt-1 text-2xl outline-none">
						{aktuell.titel}
					</h2>
					{aktuell.inhalt}

					<p role="alert" className="mt-4 min-h-6 font-medium text-signal">
						{fehler}
					</p>

					<div className="mt-4 flex flex-wrap gap-4">
						{schritt > 0 && (
							<button type="button" onClick={() => setSchritt(schritt - 1)} className="border border-stahl px-4 py-2">
								Zurück
							</button>
						)}
						<button type="submit" className="bg-signal px-5 py-2 font-medium text-papier hover:bg-signal-tief">
							{schritt < schritte.length - 1 ? "Weiter" : "Ergebnis anzeigen"}
						</button>
					</div>
				</form>
			)}

			{ergebnis && (
				<div>
					<h2 id="selbstcheck-titel" ref={ueberschrift} tabIndex={-1} className="mt-4 text-2xl outline-none">
						{TITEL[ergebnis.einstufung]}
					</h2>
					<ul className="mt-4 space-y-2">
						{ergebnis.gruende.map((g) => (
							<li key={g}>{g}</li>
						))}
					</ul>

					{pflichten(ergebnis.einstufung).length > 0 && (
						<>
							<h3 className="mt-8 text-lg">Was daraus folgt</h3>
							<ul className="mt-3 list-disc space-y-2 pl-5">
								{pflichten(ergebnis.einstufung).map((p) => (
									<li key={p}>{p}</li>
								))}
							</ul>
							<h3 className="mt-8 text-lg">Fristen</h3>
							<ul className="mt-3 space-y-2">
								{fristen.map((f) => (
									<li key={f.datum}>
										<time dateTime={f.datum} className="font-medium text-signal">
											{f.anzeige}
										</time>
										: {f.was}
									</li>
								))}
							</ul>
						</>
					)}

					{ergebnis.hinweise.length > 0 && (
						<>
							<h3 className="mt-8 text-lg">Außerdem zu beachten</h3>
							<ul className="mt-3 list-disc space-y-2 pl-5">
								{ergebnis.hinweise.map((h) => (
									<li key={h}>{h}</li>
								))}
							</ul>
						</>
					)}

					{ergebnis.einstufung === "nicht-erfasst" && (
						<p className="mt-6">
							Auch ohne eigene Pflichten kann das Gesetz Sie treffen: Erfasste
							Kunden müssen die Sicherheit ihrer Lieferkette berücksichtigen
							(§ 32 Abs. 4 lit. d) und geben Anforderungen als Fragebogen oder
							Vertragsklausel weiter.
						</p>
					)}

					<p className="mt-8 text-sm text-stahl">
						Orientierungshilfe, keine Rechtsberatung. Die Einstufung nimmt Ihr
						Unternehmen selbst vor, etwa bei der Registrierung, und die
						Cybersicherheitsbehörde kann sie überprüfen.
					</p>

					<div className="nicht-drucken mt-8 flex flex-wrap items-center gap-4">
						<a
							href={`tel:${telefonE164 || "+436506633004"}`}
							data-umami-event="telefon"
							aria-label={`Ergebnis besprechen, Telefon ${telefon || "+43 650 66 33 004"}`}
							className="inline-block bg-signal px-5 py-3 font-medium text-papier no-underline hover:bg-signal-tief"
						>
							<span>Ergebnis besprechen</span>
							<span className="ml-2 whitespace-nowrap">{telefon || "+43 650 66 33 004"}</span>
						</a>
						<button type="button" onClick={() => window.print()} className="border border-stahl px-4 py-2">
							Drucken
						</button>
						<button type="button" onClick={neuBeginnen} className="text-signal underline underline-offset-2">
							Neu beginnen
						</button>
					</div>
				</div>
			)}
		</section>
	);
}
