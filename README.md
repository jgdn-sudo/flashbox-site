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
