# Flashbox website

Static GitHub Pages site. Publish the main branch from the repository root. The calculator is at /beregner/. Contact is by email; no form service is configured.

The first-year estimate includes the initial six-week share and then the ongoing share. Business assumptions are owned by Notion. The usage scenarios and logo recipients are estimates.

## Calculator update, 11 November 2026

- Canonical URL: `/beregner/`. The existing `/beregner.html` remains supported.
- Presentation layout: `/beregner/?visning=praesentation`. This is a website to open from PowerPoint, not an embedded PowerPoint add-in. The same calculation is used in both layouts.
- The user confirmed results after VAT and before tax: a DKK 39 VAT-inclusive purchase gives DKK 6.24 at the ongoing 20% share, DKK 12.48 at the initial 40% share. The six-week minimum is DKK 3,500 after VAT, with only the shortfall added.
- The requested reference range is Fotonbox's current public method: 3% baseline, 70% to 130% of purchase-derived income, whole-currency display rounding. The fixed minimum is applied separately at each end, not multiplied down. Inputs represent assumed constant operation for 52 weeks.
- Initial six-week results, the top-up and a later ordinary year are available under the calculation details. Monthly figures are the first year's average, not a promise of identical monthly payouts.
- Print recipients are an explicit assumption and may include repeat guests. Foreign case amounts are attributed, their unknown VAT basis is visible, and they are not treated as measured Flashbox results.
- Venue names stay in the current page only. Copied links include numerical assumptions and presentation mode, not the venue name. No customer accounts, payments, report collection or dashboard data are added to this public site.
- The earlier private research calculator supplied interaction/context; its private venue example, internal links and workbook were not copied into the public site. Existing decks, contracts and private script PDFs are separate artifacts and have not been regenerated here.

Run `npm ci` and `npm test` for the 16 arithmetic, DOM-interaction and route tests. `node tools/preview.mjs` serves an optional loopback-only preview at `http://127.0.0.1:48810/beregner/`.

Visual browser QA was unavailable in the development session: browser connection absent and native window capture/input failed. DOM tests validate output and controls, not pixel layout or a real fullscreen transition.

References: [Fotonbox's public calculation](https://fotonbox.es/assets/js/main.js), [published cases](https://fotonbox.es/), [Danish VAT baseline](https://skat.dk/erhverv/moms/i-gang-med-moms). The commercial basis is the user's explicit decision, not a legal opinion about every venue's VAT treatment.

## Simplified calculator, 17 November 2026

One view with three visible fields: venue name, opening nights (dropdown, default 2) and guests per opening night (default 600). Only first-year income and its monthly average appear in the result card. Calculation assumptions, print estimates and attributed foreign examples are under the closed calculation details. Presentation mode, link-copy and fullscreen controls are removed. Existing numerical URL parameters still restore inputs; the old presentation URL uses the same single view. The name stays in page memory. The agreed arithmetic and commercial terms are unchanged.

## Meeting presentation, 17 November 2026

`/praesentation/pt-k7q3/` is a private, unlisted web version of the Pigen & Trompeten meeting deck for iPad: six slides, the embedded meeting video (plays in Safari, unlike PowerPoint for the web on iPad) and the calculator built in as slide 5, using the same model as `/beregner/`. Navigation is by arrow buttons, swipe or keyboard; a tap never changes slide. The path is not linked from the site, and robots.txt plus `noindex` keep it out of search, but anyone with the link can open it. Figures and wording mirror the PowerPoint deck; terms are owned by Notion. Speaker notes are not included.

`/praesentation/std-r8n2/` is the default, venue-neutral version of the same meeting presentation: FLASHBOX branding only, the default video (no venue logos; the final close-up shows strips with a "JERES LOGO" placeholder) and identical terms and calculator. Same visibility as above: unlisted and noindex, but open to anyone with the link.

## Slide 4, 21 November 2026 (GO v44.320)

Both meeting presentations follow the Danish script's slide 4 order: Tiltrækker folk (gratis reklame) → Passer sig selv → Ekstra indtjening (20 % i stedet for 15 %, 40 % i prøveperioden), ending with "En promoter, der betaler jer". Terms are unchanged and owned by Notion.
