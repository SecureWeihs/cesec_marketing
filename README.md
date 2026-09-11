# cesec.at

Website der Cesec e. U., Beratung für Informationssicherheit.
Maßgeblich ist `PROJEKT-BRIEF.md`; offene Fragen und dokumentierte Abweichungen
stehen in `OFFENE-PUNKTE.md`.

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
| `npm run pruefe:header` | prüft eine laufende Instanz gegen Abschnitt 14 des Briefs |

Einmalig nach dem Klonen, damit kein Versehen direkt auf `main` landet:

```bash
cp scripts/git-hooks/pre-push .git/hooks/pre-push && chmod +x .git/hooks/pre-push
```

## Warum der Build zweimal läuft

Der Brief verlangt statisch erzeugte Seiten (Abschnitt 8) **und** eine
Content-Security-Policy ohne `'unsafe-inline'` (Abschnitt 14.1). Next.js
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

## Sicherheit

Alle Antwort-Header aus Abschnitt 14.1 stehen in `next.config.ts`, die
seitenweise CSP in `src/proxy.ts`. `scripts/pruefe-header.mjs` prüft eine
laufende Instanz gegen genau diese Vorgaben und läuft in der CI gegen den
frischen Build. Meldungen zu Schwachstellen: siehe
`public/.well-known/security.txt`.
