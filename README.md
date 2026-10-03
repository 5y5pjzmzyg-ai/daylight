# Daylight

A complete local-first, static budgeting PWA. Nothing has been deployed.

## Run locally

From this project directory:

```sh
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173/ for your budget or http://localhost:4173/?demo for separate sample data. Keep the same hostname and port to keep using the same browser storage. Do not open index.html directly: modules and offline support require HTTP.

## Structure

- `dist/index.html`, `style.css`, `app.js`: accessible mobile-first interface and interactions.
- `dist/core.js`: pure date and budget calculations, amounts stored as integer euro cents.
- `dist/sw.js`: offline cache after the first successful visit.
- `dist/manifest.webmanifest`, `icons/`, `favicon.svg`: installable PWA assets.
- `tests/core.test.js`: automated calculation tests; run `node --test tests/*.test.js` (Node 18 or newer).

No build or dependencies are needed. Publish the contents of `dist/` to GitHub Pages later, keeping all relative paths intact. A `.nojekyll` file is included. No public deployment has occurred.

## Calculations and storage

Payday is the 15th, moved to Friday if Saturday or Sunday. Date arithmetic uses local calendar dates converted to UTC day numbers, avoiding daylight-saving errors. The cycle includes actual payday through the day before the next actual payday. Remaining days includes today.

Daily allowance = (category budget − category spending) / remaining days. Totals sum active categories. Values can become negative when a category is overspent; they are not clamped to zero.

Catch-up days = max(0, ceil(spent × cycle days / budget) − elapsed days including today). A zero budget with spending displays a clear no-budget/over-budget message. Changing a budget immediately changes its planned trajectory.

Browser `localStorage` holds `daylight-v1`; demo data uses `daylight-demo-v1`. No network transmission of budget data occurs. Clearing site data removes the budget. Each browser/device and each origin has separate data. A warning appears if saving is unavailable. No cloud backup or syncing is included.

At the next payday, expense entries are cleared and budgets and category settings carry forward. This happens on reopening, returning to the app, or the next periodic date check. Earlier cycle histories are intentionally not retained in V1. Archived categories are excluded from totals, retained in history, and can be restored.

## Verification completed

Seven automated test groups passed, including every calendar day from 2000–2040, weekday/weekend payday handling, December/January, February and leap years, dynamic allowances, overall allowance, catch-up days, zero budgets, negative remaining funds, cent parsing, and rollover.

Actual browser checks at 390px: dark-mode mobile layout, expense add/edit/category change/delete, category add/name/budget/emoji/colour edits, ordering, archiving, persistence after reload, and no horizontal overflow. No browser errors were reported. The app loaded from its service worker and opened expense entry with the local server stopped. Manifest and all icon/cache assets returned successfully.

## Check before deploying

- Try real category budgets in your own budget (not demo).
- Test on a physical iPhone in Safari, then Add to Home Screen. Physical iPhone installation was not available in this environment.
- Confirm light mode on a device using light appearance; the rendered QA environment used dark appearance.
- Confirm offline reload on iPhone after the first online visit.
- GitHub Pages HTTPS supports PWA operation; accessing a local HTTP address from an iPhone over Wi-Fi will not provide equivalent secure-context installation/offline behaviour.
- Local preview data will not transfer to the new GitHub Pages origin.
- When updating offline assets in future releases, bump the cache version in `sw.js`.

A feature-detected read-only browser agent tool is included if `document.modelContext` is supported. The preview browser did not expose that API, so that optional integration was not validated. The normal app does not depend on it.

## GitHub Pages deployment

The included `.github/workflows/pages.yml` runs calculation tests and publishes `dist/` on pushes to `main`. Create a GitHub repository, upload this project including its hidden `.github` directory, then choose **Settings → Pages → Source → GitHub Actions**. The workflow follows the official GitHub Pages custom workflow pattern: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages . Deployment has been prepared but not yet performed.
