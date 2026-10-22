# Instagram skills (LEVOL)

Vendored from [sergebulaev/instagram-skills](https://github.com/sergebulaev/instagram-skills)
v1.0.32 (commit 6a12448), MIT license (`LICENSE.instagram-skills`).

## Layout

- `skills/ig-*/` — the 9 skills, loaded automatically by Claude Code in this repo.
- `references/` — shared rules. `voice-profile.md` is the LEVOL profile (Spanish,
  tuteo, Spanish AI-tell list); duplicate it per client as `voice-profile.<cliente>.md`.
- `lib/` — optional Python helpers (Publora publish, Apify read, Pixfaro images).
  Run from `.claude/` so `import lib` works: `cd .claude && python -c "import lib"`.

## Optional integrations

Everything works in draft-only mode with no keys. To enable publishing/reading:

1. `pip install -r .claude/requirements.instagram-skills.txt`
2. `cp .claude/env.instagram-skills.example .claude/.env` and fill in the keys
   (`.env*` is gitignored).

## Pending in voice-profile.md

Fields marked `[COMPLETAR]`: primary link/CTA, handle, brand color, logo, and 2-4
real LEVOL captions (or run `ig-humanizer --mode profile` with real posts).
