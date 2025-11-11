# GreenEdge

GreenEdge imagines a polished review and reservation ecosystem for New York's legal cannabis scene. The project now ships as an [Astro](https://astro.build/) application with Netlify-powered serverless APIs, automated accessibility audits, and privacy-friendly analytics hooks.

## 🚀 Quick start

```bash
npm install
npm run dev
```

The development server runs at <http://localhost:4321>. Environment variables can be configured in `.env` (see `.env.example`).

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Astro in development mode with hot reload. |
| `npm run build` | Generate the production build in `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run test` | Type-check and validate the project via `astro check`. |
| `npm run accessibility` | Execute Pa11y CI audits against key routes. |

## 🧱 Project structure

```
├── astro.config.mjs          # Astro configuration with environment banner support
├── netlify.toml              # Build/deploy contexts, CDN, and function settings
├── netlify/functions/        # Serverless API endpoints
│   ├── reservations.js
│   ├── reviews.js
│   └── strains.js
├── public/                   # Static assets served as-is
│   └── scripts/              # Page-level JavaScript modules
├── src/
│   ├── layouts/BaseLayout.astro
│   ├── pages/                # Astro pages including legal policies
│   ├── styles/global.css
│   └── env.d.ts
└── .github/workflows/ci.yml  # CI: build, tests, and accessibility audits
```

## 🌐 Hosting & environments

The repository is pre-configured for Netlify hosting:

- `netlify.toml` wires the build command (`npm run build`), publish directory (`dist`), and serverless function folder (`netlify/functions`).
- Context blocks map environment-specific variables for PostHog, Plausible, and UI environment banners via `PUBLIC_DEPLOY_ENV`.
- CDN caching and SSL termination are handled automatically by Netlify's edge network.

## ☁️ Serverless APIs

| Endpoint | Methods | Purpose |
| --- | --- | --- |
| `/.netlify/functions/reviews` | `GET`, `POST` | Retrieve featured reviews or queue new submissions for moderation. |
| `/.netlify/functions/strains` | `GET` | Surface curated strain data and availability snapshots. |
| `/.netlify/functions/reservations` | `GET`, `POST` | Manage Harbor High voyage availability and reservation intake. |

The front-end experiences call these endpoints to power forms, dashboards, and simulated workflows.

## 🔍 Quality & monitoring

- **CI/CD** – `.github/workflows/ci.yml` installs dependencies, runs `astro check`, builds the site, and executes Pa11y CI accessibility audits against primary routes.
- **Analytics** – `BaseLayout.astro` conditionally embeds Plausible and PostHog scripts based on environment variables.
- **Legal policies** – `/legal/terms` and `/legal/privacy` are linked from the global footer to document platform usage and privacy practices.

## 🤝 Contributing

1. Fork or branch from `main`.
2. Install dependencies with `npm install` and run `npm run dev` to iterate locally.
3. Add or update tests/audits when introducing new features.
4. Open a pull request—CI will verify builds and accessibility before merge.

GreenEdge prioritizes accessibility, compliance, and responsible cannabis exploration. Contributions that reinforce those values are always welcome.
