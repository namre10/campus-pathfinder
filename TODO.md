# TODO — Shared Gemini AI on live demo

Finish these steps so **anyone with the GitHub Pages link** gets live Tiger Guide AI (no key paste required).

## Remaining (manual — ~2 min)

- [ ] Get a free Gemini key: [Google AI Studio](https://aistudio.google.com/apikey)
- [ ] GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**
  - Name: `VITE_GEMINI_API_KEY`
  - Value: your `AIza...` key
- [ ] Push to `main` (or run **Actions → Deploy to GitHub Pages → Run workflow**) to rebuild
- [ ] Open https://namre10.github.io/campus-pathfinder/ and confirm sidebar shows **● Google Gemini (gemini-2.0-flash)**

## Already done in repo

- [x] Tiger Guide calls Gemini API (`src/utils/tigerGuideLlm.ts`)
- [x] GitHub Actions build passes `VITE_GEMINI_API_KEY` into Vite at deploy time (`.github/workflows/deploy-pages.yml`)
- [x] `.env` is gitignored — key never committed to the repo

## Notes

- The key is embedded in the public JS bundle after deploy. Fine for a Pathfinders demo; not for production (use a backend proxy later).
- Without the GitHub secret, the live site stays in **mock mode**; visitors can still paste their own key in sidebar settings.
- Local dev: copy `.env.example` → `.env` and set `VITE_GEMINI_API_KEY=...`
