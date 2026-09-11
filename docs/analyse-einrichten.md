# Reichweitenmessung einrichten

Die Messung ist im Code vorbereitet und ausgeschaltet. Sie schaltet sich ein,
sobald zwei Umgebungsvariablen im Vercel-Projekt der Website gesetzt sind —
und mit ihr erscheint automatisch der Abschnitt in der Datenschutzerklärung.
Die folgenden Schritte kann nur der Inhaber erledigen (Zugänge,
Kosten, Einstellungen des Vercel-Projekts).

## 1. Umami betreiben

Umami ist Open Source und läuft als eigenes Vercel-Projekt mit einer
PostgreSQL-Datenbank. Beides in der EU:

1. Datenbank anlegen, Region **Frankfurt** (etwa Neon oder Vercel Postgres).
2. Das Umami-Repository als neues Vercel-Projekt importieren, Region `fra1`.
3. Umgebungsvariablen im **Umami**-Projekt:

   | Variable | Wert |
   |---|---|
   | `DATABASE_URL` | Verbindungsadresse der Datenbank |
   | `APP_SECRET` | langer Zufallswert, z. B. `openssl rand -hex 32` |
   | `SALT_ROTATION` | `day` — die Besucherkennung wechselt täglich statt monatlich |
   | `DISABLE_TELEMETRY` | `1` |

4. Anmelden, Standardpasswort sofort ändern, Zwei-Faktor-Anmeldung für das
   Administrationskonto einschalten.
5. Website `cesec.at` anlegen, die **Website-ID** notieren.
6. Einen zweiten Benutzer **nur mit Leserechten** und ohne Zwei-Faktor-Anmeldung
   für den Monatsbericht anlegen. Mit Zwei-Faktor-Anmeldung kann das
   Berichtsskript sich nicht automatisch anmelden.

## 2. Speicherdauer und Datenbank festlegen

In `src/lib/analyse.ts` zwei Werte eintragen:

- `aufbewahrungMonate` — wie lange Messdaten aufbewahrt werden. Solange der
  Wert fehlt, bricht der Build bei eingeschalteter Messung ab.
- `datenbank` — Anbieter und Region der Datenbank.

Beide stehen danach in der Datenschutzerklärung. Die Löschung nach Ablauf der
Frist muss in Umami bzw. in der Datenbank eingerichtet werden.

## 3. Website verbinden

Umgebungsvariablen im Vercel-Projekt der **Website**:

| Variable | Wert |
|---|---|
| `UMAMI_HOST` | Adresse der Umami-Instanz, z. B. `https://umami-cesec.vercel.app` |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Website-ID aus Schritt 1.5 |

Nach dem nächsten Deployment lädt die Website das Skript von
`/stats/script.js` auf dem eigenen Origin. Der Browser spricht nie mit der
Umami-Instanz direkt; die Content-Security-Policy bleibt unverändert.

`SALT_ROTATION` in Umami und `saltWechsel` in `src/lib/analyse.ts` müssen
übereinstimmen — die Datenschutzerklärung nennt den Wert.

## 4. Monatsbericht

Lokal oder als geplanter Lauf, mit diesen Umgebungsvariablen:

| Variable | Wert |
|---|---|
| `UMAMI_HOST`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | wie oben |
| `UMAMI_BENUTZER`, `UMAMI_PASSWORT` | der Lesebenutzer aus Schritt 1.6 |
| `GSC_SERVICE_ACCOUNT` | JSON-Schlüssel eines Google-Service-Accounts |
| `GSC_SITE_URL` | `sc-domain:cesec.at` |

Den Service-Account in der Google Cloud Console anlegen und in der Search
Console unter „Nutzer und Berechtigungen“ mit Leserechten hinzufügen.

```bash
node scripts/analytics-report.ts            # Vormonat → reports/JJJJ-MM.md
node scripts/analytics-report.ts --beispiel # Beispielbericht ohne Zugang
```

Zugangsdaten gehören nie ins Repository.

## 5. Vor dem Einschalten prüfen lassen

Der Abschnitt zur Reichweitenmessung in der Datenschutzerklärung ist
freigabepflichtig und Teil der rechtlichen Prüfung vor dem Go-Live. Offen für
diese Prüfung: ob die Messung ohne Cookies, aber mit Auslesen von
Bildschirmgröße und Sprache aus dem Browser, ohne Einwilligung zulässig ist
(§ 165 Abs. 3 TKG 2021).
