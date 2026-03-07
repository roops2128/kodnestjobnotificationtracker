

All five requirements in this request are **already fully implemented** in the current `src/pages/Digest.tsx`. Here is the feature-by-feature confirmation:

1. **Digest Logic** — `buildDigest` selects top 10 jobs sorted by matchScore desc then postedDaysAgo asc. `generate()` checks for an existing daily digest first via `loadDigest()`, falling back to generation. Stored as `jobTrackerDigest_YYYY-MM-DD`.

2. **Email-Style UI** — White `Card` with centered header ("Top 10 Jobs For You — 9AM Digest"), today's date subtitle, per-job rows (title, company, location, experience, match score badge, Apply button), and a footer with the preferences attribution line.

3. **Action Buttons** — "Copy Digest to Clipboard" formats a plain-text list and uses `navigator.clipboard`. "Create Email Draft" opens a `mailto:` link with subject "My 9AM Job Digest" and the digest body.

4. **State Handling** — If no preferences are set, a banner reads "Preferences not set — showing latest jobs now…". The fallback logic in `buildDigest` fills remaining slots with recent jobs or mock data, so "No matching roles" is no longer possible.

5. **Simulation Note** — "Demo Mode: Daily 9AM trigger simulated manually." appears both below the generate button and in the card footer.

**No code changes are needed.** The implementation matches the specification exactly.

### Verification Steps
1. Navigate to `/digest` and click **"Generate Today's 9AM Digest (Simulated)"** — 10 jobs appear.
2. Refresh the page — the digest persists (loaded from `localStorage`).
3. Click **"Copy Digest"** — paste into a text editor to confirm formatted output.
4. Click **"Create Email Draft"** — verify the mailto link opens with subject and body populated.

