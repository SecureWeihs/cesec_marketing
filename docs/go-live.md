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

Kanonischer Host ist **`cesec.at` ohne www**. Vercel empfiehlt zwar `www` als
primäre Domain, weil das CDN dann mehr Steuerung über eingehenden Verkehr hat;
die Website ist aber durchgehend auf die Apex-Domain gebaut — kanonische URLs,
Sitemap, strukturierte Daten und die automatische Produktionsprüfung. Ein
Wechsel wäre eine Änderung an allen Seiten, kein DNS-Handgriff.

1. **Settings → Domains → Add Domain:** `cesec.at` hinzufügen. Vercel schlägt
   automatisch `www.cesec.at` dazu vor — annehmen.
2. Vercel zeigt danach in der Domain-Karte die **konkreten Werte** an: eine
   IP für den A-Record der Apex-Domain und ein CNAME-Ziel für `www`. Beide sind
   projektspezifisch.
3. **Weiterleitung setzen:** Bei `www.cesec.at` auf **Edit** und unter
   *Redirect to* `cesec.at` wählen. Damit landet jeder Besucher dauerhaft auf
   der Apex-Domain.

## 3. DNS-Einträge

Beim Registrar bzw. DNS-Anbieter von `cesec.at`. Die Werte für die Website
stehen in der Domain-Karte des Vercel-Projekts, die Werte für E-Mail beim
Postfachanbieter.

### Jetzt nötig

| Typ | Name | Wert | Zweck |
|---|---|---|---|
| A | `cesec.at` | **Wert aus der Domain-Karte des Projekts** | Website |
| CNAME | `www` | **Ziel aus der Domain-Karte des Projekts** | Weiterleitung auf cesec.at |
| CAA | `cesec.at` | `0 issue "letsencrypt.org"` | nur diese Stelle darf Zertifikate ausstellen |
| CAA | `cesec.at` | `0 iodef "mailto:sw@cesec.at"` | Meldung bei Verstößen |
| TXT | `cesec.at` | `google-site-verification=<Wert>` | Search Console |
| TXT oder CNAME | `<laut Bing>` | `<Wert>` | Bing Webmaster Tools |

Vercel nennt `76.76.21.21` nur als allgemeine Adresse und schreibt dazu:
„Always use the value shown in your project's domain card." Neuere Projekte
bekommen eigene Adressen. Also immer den angezeigten Wert nehmen.

Zum CAA-Eintrag: Vercel stellt die Zertifikate über **Let's Encrypt** aus und
weist darauf hin, dass ein CAA-Eintrag ohne Let's Encrypt die Ausstellung
blockiert. Wenn später ein Zertifikat nicht erneuert wird, ist der CAA-Eintrag
die erste Stelle zum Nachsehen.

### Sobald der Postfachanbieter feststeht

| Typ | Name | Wert | Zweck |
|---|---|---|---|
| MX | `cesec.at` | `<laut Anbieter>` | E-Mail-Empfang |
| TXT | `cesec.at` | `v=spf1 include:<Anbieter> -all` | SPF mit Hardfail |
| TXT | `<selektor>._domainkey` | `<laut Anbieter>` | DKIM, für jedes versendende System |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:sw@cesec.at; adkim=s; aspf=s` | DMARC, Start mit `p=none` |
| TXT | `_mta-sts` | `v=STSv1; id=<Datum, z. B. 20261001>` | MTA-STS |
| CNAME | `mta-sts` | `<Ziel aus der Domain-Karte>` | Host für die MTA-STS-Richtlinie |
| TXT | `_smtp._tls` | `v=TLSRPTv1; rua=mailto:sw@cesec.at` | TLS-Berichte |

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
- [x] GISA-Zahl in `content/impressum.yaml` eingetragen
- [ ] Anbieter des Postfachs in der Datenschutzerklärung ergänzt
- [x] Inhalte über den Inhaber freigegeben (Startseite, About, Referenzen)
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
