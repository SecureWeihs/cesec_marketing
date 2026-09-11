# cesec.at

Website der Cesec e. U., Beratung für Informationssicherheit.
Die Spezifikation und die Liste der offenen Punkte liegen außerhalb dieses
Repositorys; die Entscheidungen, die den Code prägen, sind unten und in den
Quelldateien selbst begründet.

## Stack

Next.js 16 (App Router, alle Inhaltsseiten statisch erzeugt) · TypeScript im
Strict-Modus · Tailwind 4 · gehostet auf Vercel in der Region `fra1`.
Keine UI-Bibliothek, kein CMS, keine Datenbank, keine Drittanbieter-Skripte.

## Entwickeln

```bash
npm ci
npm run dev      # http://localhost:3000
```

| Befehl | Wirkung |
|---|---|
| `npm run build` | baut, erzeugt die CSP-Hashes und prüft sie gegen den Build |
| `npm run typecheck` | TypeScript ohne Ausgabe |
| `npm run lint` | ESLint |
| `npm run pruefe:header` | prüft eine laufende Instanz gegen die Sicherheitsvorgaben |

Einmalig nach dem Klonen, damit kein Versehen direkt auf `main` landet:

```bash
cp scripts/git-hooks/pre-push .git/hooks/pre-push && chmod +x .git/hooks/pre-push
```

## Warum der Build zweimal läuft

Verlangt sind statisch erzeugte Seiten **und** eine Content-Security-Policy
ohne `'unsafe-inline'`. Next.js
schreibt pro Seite zwei Inline-Skripte in das HTML. Eine Nonce würde beides
gegeneinander ausspielen, weil sie pro Abruf neu erzeugt werden müsste und
damit serverseitiges Rendern bei jedem Aufruf erzwingt.

Stattdessen werden die Inline-Skripte gehasht:

1. `next build` erzeugt das HTML
2. `scripts/csp-hashes.mjs` liest die Inline-Skripte und schreibt die Hashes
   nach `src/generated/csp-hashes.json`
3. `next build` läuft erneut, damit `src/proxy.ts` die Hashes ausliefert
4. `scripts/csp-hashes.mjs --verify` stellt sicher, dass die Hashes noch zum
   erzeugten HTML passen — sonst bricht der Build ab

Damit das deterministisch bleibt, hängt die Build-ID am Commit
(`generateBuildId` in `next.config.ts`) und nicht an einem Zufallswert.

`src/generated/csp-hashes.json` ist deshalb im Repository nur ein Platzhalter:
die Hashes hängen an der Build-ID und damit am Commit, der sie enthält — die
Datei kann sich also gar nicht selbst enthalten. Verbindlich ist immer das
Ergebnis von `npm run build`, und Schritt 4 bricht ab, falls es nicht passt.
`next build` allein genügt deshalb nie für ein Deployment.

## Bilder und Symbole

Alles unter `public/bilder`, `public/og` sowie die Symbole und `logo.svg` sind
Erzeugnisse. Quelle ist `assets/source/`, das weder ausgeliefert noch versioniert
wird: dort liegen die unbearbeiteten Dateien mitsamt ihren Metadaten.

```bash
npm run assets          # erzeugt alles neu aus assets/source
npm run pruefe:bilder   # scheitert, sobald eine Datei Metadaten trägt
```

`assets/source/` enthält dafür:

| Datei | Zweck |
|---|---|
| `pb_2026.jpg` | Porträt, 1230 × 1830 mit 15 px schwarzem Rahmen |
| `Cesec Logo_größer.png` | Vorlage der Bildmarke |
| `schriften/Inter-{Regular,SemiBold}.ttf` | Schrift für die Vorschaubilder |
| `schriften/SourceSerif4-Semibold.otf` | Schrift für die Vorschaubilder |
| `fontconfig/fonts.conf` | damit librsvg die beiden findet |

Die statischen Schriftschnitte stammen aus den Veröffentlichungen von
[rsms/inter](https://github.com/rsms/inter/releases) und
[adobe-fonts/source-serif](https://github.com/adobe-fonts/source-serif), beide
SIL OFL 1.1. Fehlen sie, läuft `npm run assets` trotzdem durch und meldet, dass
die Vorschaubilder mit Ersatzschriften gesetzt wurden.

Die Bildmarke liegt als Vektorpfad in `src/lib/logo.ts` und ist die einzige
Quelle für Kopfzeile, Favicons und Vorschaubilder. Sie wurde aus der
PNG-Vorlage nachgezogen, weil kein Vektorlogo vorliegt; der Farbverlauf der
Vorlage ist dabei entfallen. Kein Bild läuft über `next/image`: die Komponente
setzt Inline-Styles, die die Content-Security-Policy nicht erlaubt.

## Sicherheit

Alle festen Antwort-Header stehen in `next.config.ts`, die
seitenweise CSP in `src/proxy.ts`. `scripts/pruefe-header.mjs` prüft eine
laufende Instanz gegen genau diese Vorgaben und läuft in der CI gegen den
frischen Build. Meldungen zu Schwachstellen: siehe
`public/.well-known/security.txt`.
