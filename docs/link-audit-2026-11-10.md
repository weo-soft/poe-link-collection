# Link-Audit PoE & PoE2 — 10.11.2026

**Scope:** Alle im Hub hinterlegten externen Links für *Path of Exile 1* und *Path of Exile 2*.
**Prüfzeitraum:** 10.11.2026, 21:52–22:02 CET (20:52–21:02 UTC), zwei vollständige Durchläufe.
**Ergebnisdatei (alle 178 Ziele, maschinenlesbar):** [`link-audit-2026-11-10.csv`](./link-audit-2026-11-10.csv)

> Die Abschnitte 4–10 dokumentieren den **Stand vor der Umsetzung**. Die daraufhin vorgenommenen Datenänderungen sind in Abschnitt 11 aufgeführt.

## 1. Umfang

| Quelle | Ziele |
|---|---|
| `public/data/link-items.json` | 175 Einträge, davon 172 einzigartige URLs |
| `public/data/events.json` + `leagues.json` (`detailsLink`) | 4 einzigartige URLs |
| Eigene Seiten (Hub, GitHub-Repo) | 2 URLs |
| **Gesamt geprüft** | **178 Ziele** |

## 2. Methode

- HTTP GET mit realistischem Desktop-User-Agent, Redirects verfolgt, Timeout 30 s, zwei Durchläufe (Abweichungen: keine).
- Bewertung von Statuscode, finaler URL, Seitentitel und Inhalt (u. a. Erkennung von Park-, Wartungs-, Hiatus- und GitHub-Pages-404-Seiten).
- Für JS-lastige Seiten/SPAs zusätzlich Rendering mit Headless-Chromium (DOM + Titel).
- Zusatzprüfungen: DNS/TCP für Timeout-Kandidaten, Discord-Invite-API für Discord-Links, YouTube-oEmbed für die beiden Video-Links, direkter Bildabruf für den Reddit-Media-Link.
- Nicht prüfbar bzw. eingeschränkt: Seiten hinter Cloudflare-/Bot-Challenges (siehe Abschnitt 6), Log-in-Inhalte, regionale Sperren, Verhalten nach Klick auf der Seite.

## 3. Ergebnis auf einen Blick

| Bewertung | Anzahl Ziele |
|---|---|
| Erreichbar, ohne Auffälligkeit | 152 |
| Erreichbar, aber mit Hinweis (Redirect, Rename, veralteter Inhalt) | 15 |
| **Defekt / nicht erreichbar** | **5** |
| **Erreichbar, aber Funktion pausiert** | **2** |
| **Nicht sicher verifizierbar (Bot-Schutz)** | **4** |
| Summe | 178 |

Betroffene Hub-Einträge: 12 von 175 (mehrere Einträge teilen sich eine URL, z. B. Hideout Showcase und Discord).

## 4. Defekte Links (Handlungsbedarf)

| # | Eintrag (Kategorie/Spiel) | URL | Beobachtung | Empfehlung |
|---|---|---|---|---|
| 1 | Tincture PoE 2 (`builds`/PoE2) | https://tincturepoe2.com/ | HTTP **404** „Site not found · GitHub Pages“. `www.tincturepoe2.com` verweist per CNAME auf `luther-rotmg.github.io`; dieser GitHub-Account ist nicht mehr erreichbar (https://github.com/luther-rotmg → 404). | Entfernen oder Ersatz suchen. |
| 2 | Path of Exile Discord (`socials`/PoE1+PoE2) | https://discord.com/pathofexile | HTTP **404** „Page Not Found · Discord“. Der Vanity-Code ist gültig, aber nur unter `discord.gg/<code>` bzw. `discord.com/invite/<code>`. | URL ersetzen durch **https://discord.gg/pathofexile** (verifiziert: leitet auf `discord.com/invite/pathofexile`, Invite-API liefert Server „Path of Exile 1 & 2“). |
| 3 | simplex.gg (`trackers`/PoE1) | https://simplex.gg/ | HTTP **402**, Vercel-Fehlerseite „Payment required / `DEPLOYMENT_DISABLED`“. | Prüfen, ob das Projekt umgezogen ist; sonst entfernen. |
| 4 | PoE Antiquary (`more-links`/PoE1) | https://poe-antiquary.xyz/ | DNS löst auf `46.101.182.30` auf, aber TCP 80 und 443 laufen in einen **Timeout** (mehrfach, auch mit Browser); keine HTTP-Antwort. | Wahrscheinlich offline. Entfernen oder bis auf Weiteres als „offline“ kennzeichnen. |
| 5 | Hideout Showcase (`more-links`/PoE1 **und** PoE2) | https://hideoutshowcase.com/ | TLS-Handshake erfolgreich (Let’s-Encrypt-Zertifikat für die Domain), danach **Empty reply** (curl 52) bzw. **HTTP/2 PROTOCOL_ERROR**; Browser-DOM leer. Ein einzelner früherer Test lieferte HTTP 200 → instabil. | Derzeit nicht nutzbar. Kurzfristig erneut prüfen; falls weiterhin kaputt, entfernen (2 Einträge). |

## 5. Erreichbar, aber nicht wie erwartet (pausiert)

| # | Eintrag | URL | Beobachtung | Empfehlung |
|---|---|---|---|---|
| 6 | Path of Crafting (`crafting`/PoE2) | https://pathofcrafting.net/ | HTTP 200, Seite **„Currently on Hiatus“**. Der Crafting-Simulator ist abgeschaltet; die Seite erklärt die Gründe. | Als pausiert kennzeichnen oder entfernen. |
| 7 | POEdle (`fluff-meme-games`/PoE1+PoE2) | https://www.poedle.net/ | Leitet auf `/maintenance` weiter: **„Resting in Hideout“** (POEdle) – laut Seite „a short break“. | Temporär; beobachten, kein akuter Handlungsbedarf. |

## 6. Nicht sicher verifizierbar (Bot-/Cloudflare-Schutz)

Diese Ziele liefern von hier aus **HTTP 403 mit Cloudflare-Challenge „Just a moment…“**. Das ist **kein Beweis für einen Defekt** – die Seiten können im normalen Browser einwandfrei funktionieren. Eine sichere Aussage ist von dieser Umgebung aus nicht möglich, auch nicht mit Headless-Chromium.

| # | Eintrag | URL | Beobachtung |
|---|---|---|---|
| 8 | Official Trade (`trade`/PoE1) | https://www.pathofexile.com/trade | 403 Cloudflare-Challenge; Inhalt nicht prüfbar. Offizieller Endpoint, sehr wahrscheinlich intakt. |
| 9 | Official Trade (`trade`/PoE2) | https://www.pathofexile.com/trade2 | 403 Cloudflare-Challenge; Inhalt nicht prüfbar. Offizieller Endpoint, sehr wahrscheinlich intakt. |
| 10 | Mobalytics PoE 2 (`builds`/PoE2) | https://mobalytics.gg/poe-2/builds | 403 Cloudflare-Challenge. `https://mobalytics.gg/poe` ließ sich dagegen im Browser korrekt laden → Vermutung: Challenge/Schutz nur für diesen Pfad, nicht zwingend ein Defekt. **Manuell im Browser prüfen.** |
| 11 | PoBArchives (`builds`/PoE1+PoE2) | https://pobarchives.com | 403 Cloudflare-Challenge, sogar für `robots.txt`. Domain/TLS/Cloudflare sind aktiv, Inhalt aber nicht verifizierbar. **Manuell im Browser prüfen.** |

> Hinweis: `poewiki.net`, `poe2wiki.net` und das Firefox-Addon `Indie Wiki Buddy` zeigten bei reinem HTTP ebenfalls Bot-Challenges, ließen sich aber im Headless-Browser mit korrektem Titel und Inhalt laden → als funktionsfähig bewertet.

## 7. Erreichbar, aber mit Abweichungen (dokumentiert, kein Defekt)

| Eintrag | Beobachtung |
|---|---|
| Divine Tendies (`economy`/PoE2) | `https://divine-tendies.vercel.app/` leitet auf **https://www.divinetendies.com/** weiter. Funktioniert; URL kann direkt aktualisiert werden. |
| PoE Builds (`builds`/PoE1) | `https://www.poebuilds.cc/poe/` leitet auf `/poe1` weiter (funktioniert). |
| PoE Disenchant (derzeit unbenutzter Eintrag) | `https://poe-disenchant-tool.vercel.app/` leitet auf `/standard` weiter (funktioniert). |
| 4× PoELab (`labyrinth`/PoE1) | Die gespeicherten URLs leiten auf **täglich wechselnde** Slugs weiter (`/2faxk/` → `/nkhsa/` usw.). Inhalt (Normal/Cruel/Merciless/Uber) stimmt, aber die Slugs sind nicht stabil. Ggf. auf `https://www.poelab.com/` verlinken. |
| PoE Trade Helper (`browser-extensions`/PoE1) | Chrome-Web-Store-Eintrag heißt inzwischen **„EasyExile Trade Extension“** (gleiche Extension-ID). Link funktioniert; Name im Hub ist veraltet. |
| Exile’s Path (`builds`/PoE1) | `https://www.exiles-path.com/` leitet auf `/league/mirage` weiter; die Seite zeigt **Mirage (3.28)**, während die Hub-Beschreibung „Keepers of the Flame“ nennt und PoE1 aktuell 3.29 (Allflame) ist → **Inhalt veraltet**, Link selbst funktioniert. |
| Poe.Ninja Economy (`economy`/PoE1) | `https://poe.ninja/poe1/economy/allflame/currency` liefert weiterhin 200 (auch nach Liga-Ende am 10.11.2026, 21:00 UTC). Die URL ist liga-spezifisch und wird mit **Covens of Umbra (Start 13.11.)** veraltet; dann auf die neue Liga-URL wechseln. |
| PoE 3.28 Cheat Sheets (`more-links`/PoE1) | Blatt funktioniert, ist aber noch mit **3.28** betitelt (aktuell 3.29) – Inhalt evtl. veraltet. |
| Idol Planner / Phrecia Map Planner / Phrecia Idol Regex Builder (`atlas`, `more-links`/PoE1) | Seiten funktionieren, tragen aber noch **Phrecia**-Bezeichnungen (ältere Liga). Prüfen, ob die Inhalte noch gepflegt werden. |
| PoEDb (`resources`/PoE1) | `https://poedb.tw/` leitet auf `/us/` weiter (funktioniert). |
| Google Docs/Sheets (6 Links) | Hängen automatisch `/edit` an und sind öffentlich lesbar (Titel der Dokumente wird ausgeliefert) – funktioniert. |
| Event-/Liga-Detaillinks (4) | `events.json` (Forbidden Rites, PoE2 1.0 Full Release) und `leagues.json` (Curse of the Allflame, Covens of Umbra) liefern alle HTTP 200 mit passenden Titeln. |

## 8. Datenhinweise (unabhängig von der Erreichbarkeit)

- **`lastChecked` ist überall `2026-08-09T18:00:00Z`.** Der Hub zeigt damit ein veraltetes Prüfdatum an; nach diesem Audit sollte es für geprüfte Einträge aktualisiert werden.
- **6 Einträge in `link-items.json` werden von `links.json` derzeit nicht referenziert** (Reste der früheren `temp-league`-Kategorie):
  `poe-disenchant`, `atziri-temple-cheatsheet-reddit-poe2`, `atziri-temple-cheatsheet-google-poe2`, `poe2db-atziri-temple-poe2`, `atziri-temple-video-1-poe2`, `atziri-temple-video-2-poe2`.
  Die darin enthaltenen URLs wurden trotzdem mitgeprüft; alle sind erreichbar.
- **`updates.json`** enthält in einem historischen „removed“-Eintrag die fehlerhafte URL `https://discord.com/3VxKY6gt7j` (ohne `/invite/`). Sie wird nicht als Link gerendert, ist also kein akutes Problem, erklärt aber vermutlich den Ursprung des defekten Discord-Links.
- Alle drei Discord-Einladungen (`VWadrh2`, `cY6jCQgwDM`, `qRyyrMyrkz`) sind laut Invite-API **gültig**, ebenso der Vanity-Code `pathofexile` (nur die URL-Struktur im Hub ist falsch).

## 9. Empfohlene Reihenfolge

1. **Sofort:** Discord-URL auf `https://discord.gg/pathofexile` korrigieren (1 Zeile, beide Spiele profitieren).
2. **Kurzfristig:** `tincturepoe2` entfernen/ersetzen; `simplex`, `poe-antiquary` und `hideoutshowcase` (2 Einträge) nach manueller Gegenprüfung entfernen oder als offline markieren.
3. **Kennzeichnen:** `path-of-crafting` (Hiatus) und `poedle` (Wartung) als pausiert markieren oder vorübergehend ausblenden.
4. **Manuell im normalen Browser prüfen:** `pathofexile.com/trade`, `/trade2`, `mobalytics.gg/poe-2/builds`, `pobarchives.com` (Cloudflare).
5. **Pflege:** `divine-tendies`-URL aktualisieren, `poe-trade-helper` umbenennen, `poe.ninja`-Liga-URL nach dem 13.11. anpassen, `lastChecked` für alle Einträge auf den Audit-Zeitpunkt setzen.

## 10. Grenzen des Audits

- Geprüft wurde die **Erreichbarkeit und grobe inhaltliche Passung**, nicht jede Funktion innerhalb der Seiten (z. B. Login, Suche, Datenaktualität im Detail).
- Cloudflare-geschützte Seiten (Abschnitt 6) konnten inhaltlich **nicht** bestätigt werden.
- Momentaufnahme: Seiten können kurzfristig ausfallen oder wieder verfügbar sein (siehe Hideout Showcase). Die CSV enthält den exakten Stand vom 10.11.2026.

## 11. Umsetzung (10.11.2026)

Auf Basis dieses Audits wurden die folgenden Änderungen am Datenbestand vorgenommen:

**Entfernt** (Eintrag + Referenz in `links.json`):
- `tincturepoe2` (Tincture PoE 2) – defekt
- `simplex` (simplex.gg) – defekt
- `path-of-crafting` (Path of Crafting) – Hiatus
- `exiles-path-keepers` (Exile’s Path) – Inhalt veraltet
- `keepers-of-the-flame-guide` (Keepers of the Flame League Challenge Guide)
- die 6 zuvor unreferenzierten Einträge: `poe-disenchant`, `atziri-temple-cheatsheet-reddit-poe2`, `atziri-temple-cheatsheet-google-poe2`, `poe2db-atziri-temple-poe2`, `atziri-temple-video-1-poe2`, `atziri-temple-video-2-poe2`

**Aktualisiert:**
- `path-of-exile-discord`: URL → `https://discord.gg/pathofexile`
- `poe-trade-helper`: Name → „EasyExile Trade Extension“
- `phrecia-map-planner`: von `atlas/poe1` nach `more-links/poe1` verschoben
- `lastChecked` aller verbleibenden Einträge → `2026-11-10T21:00:00Z`

**Als Status markiert** (neues optionales Feld `status` in `link-items.json`, sichtbar als „!“-Icon mit eigenem Tooltip):
- `poe-antiquary` → `temporarily-offline` („Temporarily offline“)
- `poe-3-28-cheat-sheets` → `outdated` („Outdated“)
- `phrecia-map-planner` → `outdated` („Outdated“)

**Technisch:** `validateLink` akzeptiert nur die Statuswerte `offline`, `temporarily-offline`, `outdated`; `renderLink` rendert daraus ein kleines „!“-Icon; der Tooltip des Icons erklärt den Status, das Aria-Label des Links nennt ihn ebenfalls. Dafür wurden Unit-Tests ergänzt.

**Datenstand danach:** 164 Einträge, alle von `links.json` referenziert. Die CSV in diesem Verzeichnis ist der **Snapshot vor** diesen Änderungen.
