# Go-Live

Der Go-Live auf der Produktionsdomain ist freigabepflichtig (Brief, Abschnitt 1).
Diese Anleitung sammelt alles, was dafür außerhalb des Codes zu tun ist. Werte in
spitzen Klammern `<…>` sind noch offen.

## 1. Vercel-Projekt

Wie bei der früheren Website: Vercel holt den Code aus GitHub.

1. Auf vercel.com „Add New → Project“, Repository `SecureWeihs/cesec_marketing`
   importieren.
2. Einstellungen:

   | Einstellung | Wert |
   |---|---|
   | Framework Preset | Next.js |
   | Install Command | `npm ci --ignore-scripts` |
   | Build Command | `npm run build` (nicht `next build` — der Build läuft zweimal, siehe README) |
   | Node.js Version | 24.x |
   | Function Region | Frankfurt, `fra1` |

3. **Settings → Deployment Protection:** Schutz für Preview-Deployments
   einschalten. Zusätzlich setzt die Website auf Vorschauen selbst
   `X-Robots-Tag: noindex, nofollow`.
4. **Settings → Security:** Zwei-Faktor-Anmeldung für das Vercel-Konto.
5. Keine Umgebungsvariablen mit Personenbezug. Für die Reichweitenmessung siehe
   `docs/analyse-einrichten.md`.

## 2. Domains in Vercel

1. `cesec.at` als Produktionsdomain hinzufügen.
2. `www.cesec.at` hinzufügen und auf `cesec.at` umleiten lassen, **dauerhaft (308
   oder 301)**. Kanonischer Host ist `cesec.at` ohne www.
3. Vercel zeigt dann die DNS-Werte an, die gesetzt werden müssen.

## 3. DNS-Einträge

Beim Registrar bzw. DNS-Anbieter von `cesec.at`. Die Werte für die Website kommen
aus Vercel (Schritt 2), die Werte für E-Mail vom Postfachanbieter.

| Typ | Name | Wert | Zweck |
|---|---|---|---|
| A oder ALIAS | `cesec.at` | `<laut Vercel>` | Website |
| CNAME | `www` | `<laut Vercel>` | Weiterleitung auf cesec.at |
| CAA | `cesec.at` | `0 issue "<Zertifizierungsstelle laut Vercel>"` | nur diese Stelle darf Zertifikate ausstellen |
| CAA | `cesec.at` | `0 iodef "mailto:sw@cesec.at"` | Meldung bei Verstößen |
| TXT | `cesec.at` | `v=spf1 include:<Postfachanbieter> -all` | SPF mit Hardfail |
| TXT | `<selektor>._domainkey` | `<laut Postfachanbieter>` | DKIM, für jedes versendende System |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:sw@cesec.at; adkim=s; aspf=s` | DMARC, Start mit `p=none` |
| TXT | `_mta-sts` | `v=STSv1; id=<Datum, z. B. 20261001>` | MTA-STS |
| CNAME | `mta-sts` | `<laut Vercel>` | Host für die MTA-STS-Richtlinie |
| TXT | `_smtp._tls` | `v=TLSRPTv1; rua=mailto:sw@cesec.at` | TLS-Berichte |
| TXT | `cesec.at` | `google-site-verification=<Wert>` | Search Console |
| CNAME oder TXT | `<laut Bing>` | `<Wert>` | Bing Webmaster Tools |

Dazu:

- **DNSSEC** beim Registrar einschalten.
- **Keine Wildcard-Einträge** (`*.cesec.at`), keine ungenutzten Subdomains — sie
  sind ein Einfallstor für Subdomain-Übernahmen.
- **DMARC** nach vier Wochen Auswertung auf `p=quarantine`, danach auf
  `p=reject`.
- **MTA-STS** braucht zusätzlich eine Richtliniendatei unter
  `https://mta-sts.cesec.at/.well-known/mta-sts.txt` mit den MX-Hosts des
  Postfachanbieters. Sie wird ergänzt, sobald der Anbieter feststeht.
- **secure-way.at:** Den alten DNS-Eintrag erst löschen, wenn entschieden ist,
  ob die Domain per 301 auf cesec.at umgeleitet wird (empfohlen, solange die
  Domain gehalten wird).

## 4. Vor dem Go-Live

- [ ] Rechtstexte (Impressum, Datenschutz, Barrierefreiheit) freigegeben und über
      WKO oder Anwalt geprüft
- [ ] GISA-Zahl in `content/impressum.yaml` eingetragen
- [ ] Anbieter des Postfachs in der Datenschutzerklärung ergänzt
- [ ] Inhalte über den Inhaber freigegeben (Startseite, About, Referenzen)
- [ ] Offene Punkte geklärt oder bewusst offen gelassen

## 5. Nach dem ersten Produktions-Deployment

Die GitHub-Action „Produktion prüfen“ läuft nach jedem Produktions-Deployment
automatisch: Zertifikat, www-Weiterleitung, alle Header, CSP, Fremd-Hosts und
Abnahmekriterien auf allen Seiten der Sitemap.

Einmalig von Hand (Screenshots in den Abnahme-Pull-Request):

- [ ] securityheaders.com → A+
- [ ] developer.mozilla.org/observatory → A+
- [ ] ssllabs.com/ssltest → A+
- [ ] Lighthouse mobil auf Startseite, `/nis2-nisg-2026` und einem Leitfaden →
      100/100/100/100 (entscheidet auch über W2, das JavaScript-Budget)
- [ ] Rich-Results-Test und Schema-Markup-Validator ohne Fehler
- [ ] Tastaturdurchlauf aller Seitentypen
- [ ] Search Console und Bing per DNS verifizieren, Sitemap einreichen

Später:

- [ ] HSTS-Preload auf hstspreload.org beantragen — erst, wenn alle Subdomains
      dauerhaft HTTPS können
- [ ] Kalendereintrag: `security.txt` läuft am **11.09.2027** ab und muss vorher
      erneuert werden
- [ ] Google-Unternehmensprofil beanspruchen, auf „Cesec e. U.“ umbenennen,
      Adresse ausblenden, Einzugsgebiet pflegen, Adresse zeichengenau wie in
      `NAP.md`; danach die Profil-URL in `content/impressum.yaml` eintragen
