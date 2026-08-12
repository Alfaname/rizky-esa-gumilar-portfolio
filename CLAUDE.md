# Project — Rizky Esa Gumilar · Strategic Finance & Decision Intelligence

Public portfolio, static site, deployed on GitHub Pages at
`https://alfaname.github.io/rizky-esa-gumilar-portfolio/`.

## Non-negotiables

- Positioning: **Strategic Finance & Decision Intelligence**. Finance judgment and
  decision speed are the subject; technology is only an enabler. Never present this
  as a dashboard/Apps Script/spreadsheet portfolio.
- Hero headline (locked, stays English in both languages):
  `Financial clarity for faster decisions.`
- Vision (locked ID): `Informasi keuangan harus mengarahkan keputusan, bukan hanya mencatat hasil.`
  EN: `Financial information should guide decisions, not merely record outcomes.`
- Primary CTA (locked): ID `Perjelas Langkah Berikutnya →` / EN `Clarify the Next Move →`,
  always to the WhatsApp deep link with the approved prefilled message.
- Indonesian is the default language; English is a toggle. Both must read as native copy.
- Identity: `assets/img/portrait-*` are derived **only** from the single approved
  portrait. Never substitute another photo or regenerate a face.
- Exactly three flagship case studies, in this order: Marketplace Financial
  Intelligence, Project Financial Performance, Cash & Financial Visibility.
- No fabricated metrics: no years of experience, client counts, savings or ROI claims.
- No employer, client, project, vendor or person names anywhere.
- No GitHub link in the public contact/social area, and no CV download.

## Privacy rule

All figures on the site are portfolio-safe reconstructions that preserve real
financial *logic* (formulas, relationships, categories, decision questions) but not
confidential values. Every case study carries a visible disclosure of this. Never
commit anything from a `DO_NOT_COMMIT` folder, and never place spreadsheet IDs,
Apps Script IDs, Drive links or internal URLs in source, comments or metadata.

## Code conventions

- No build step, no framework, no CDN. Plain HTML/CSS/JS so GitHub Pages serves the
  repo root directly. All asset paths are relative (`assets/…`) so the project
  subpath works.
- Scripts are classic (non-module) and load in order: `data.js` → `i18n.js` →
  `charts.js` → `case-studies.js` → `compression.js` → `main.js`.
- Copy lives in `assets/js/i18n.js` as `ID`/`EN` pairs keyed by `data-i18n`.
  Chart labels are localized through `t()` and charts re-render on language change.
- Case-study numbers live in `assets/js/data.js` and are **derived by formula**
  (net = gross − discount, margin = net − fee − COGS, …) so the published figures
  stay internally consistent.
- Colors are CSS custom properties in `assets/css/style.css`. The categorical
  series palette (`--s1…--s4`) was validated for contrast and colour-vision
  separation against the dark chart surface; do not hand-edit those hexes.
- Motion respects `prefers-reduced-motion`: every animated section has a static,
  fully readable end state.

## State

Working state, current milestone and the exact next action live in
`.claude/PORTFOLIO_STATE.md` (git-ignored, local only).
