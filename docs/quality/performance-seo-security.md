# Quality Audits (Performance, SEO, Security)

Automated tests validate behaviour, but we also maintain routine quality audits across three pillars.

## Performance

- **Metrics:** Core Web Vitals (LCP, CLS, INP).
- **Recommended tools:**
  - [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) – run against `/`, `/products/[slug]`, `/cart`, `/place-order`.
  - `next build --analyze` (set `ANALYZE=true`) to inspect bundle size and identify heavy components.
  - Chrome Performance panel for profiling long interactions.
- **Actions:**
  - Address expensive React renders flagged in the profiler.
  - Monitor image weights; prefer WebP and Next `<Image>` optimisations.
  - Track layout shifts introduced by dynamic content.

## SEO

- **Checks:**
  - Confirm metadata via `document.head` inspection or the browser’s Elements panel.
  - Run Lighthouse SEO audits to ensure titles, canonical links, and structured data (if any) are present.
  - Validate sitemap and robots directives whenever routing changes.
- **Maintenance:** Every new route must export `metadata`/`generateMetadata` (see `.cursorrules`). Update docs if patterns change.

## Security

- **Dependency scanning:** `npm audit` for vulnerable packages; run after each dependency update.
- **Headers:** Vercel/Next middleware should enforce `Content-Security-Policy`, `Strict-Transport-Security`, and other recommended headers (add checks when deploying custom middleware).
- **Secrets:** Keep Prisma/Next env variables in `.env` and never commit secret values; rotate credentials after incidents.
- **Testing:** Consider integrating Snyk/GitHub Dependabot for automated alerts.

## Workflow integration

- Schedule Lighthouse CI or GitHub Actions to run performance/SEO audits on pull requests.
- Extend Vitest or Playwright suites with assertions for critical headers if middleware is added.
- Update this document whenever new tooling or quality gates are introduced.

