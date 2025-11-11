# GreenEdge

GreenEdge is a concept website that imagines a polished review ecosystem for New York's legal cannabis scene. The project now
brings every prototype together into a cohesive experience:

- **Landing page (`index.html`)** – Highlights the platform vision, links to every interactive module, and spells out roadmap
  priorities.
- **NYC Dispensary Interface (`pages/review-interface.html`)** – Filter strains, spotlight trending releases, and peek at the
  next set of enhancements.
- **Smart Review System (`pages/review-system.html`)** – Walk through a scanner-powered review flow, log effects, and unlock
  rewards.
- **Harbor High Voyage Log (`pages/boat-reviews.html`)** – Capture boat club tastings and handle reservation requests.
- **Weed Town Square (`pages/weed-town-square.html`)** – Rotate community prompts, vote on marquee events, and scan civic
  updates.
- **Micro-Grow Lab (`pages/growing-lab.html`)** – Simulate compliant home-grow decisions with day progression and plant care
  mechanics.

All pages share a common look and feel through `assets/styles.css` and lightweight JavaScript modules inside `assets/`.

## Getting started

This is a static project—open `index.html` in your browser to explore. Every linked page lives in the `pages/` directory and
uses relative paths, so no build tools are required.

```
# From the project root
open index.html            # macOS
xdg-open index.html        # Linux
```

## Project structure

```
assets/
  styles.css               Shared styles for the full site
  site.js                  Scroll + animation helpers for the landing page
  review-interface.js      Data + filtering logic for the NYC strain explorer
  review-system.js         Scanner simulation and rewards logic
  town-square.js           Prompt shuffle + community poll interactions
  growing-lab.js           Micro-grow simulator state management
pages/
  review-interface.html    Dispensary discovery experience
  review-system.html       Scanner-guided review flow
  boat-reviews.html        Harbor High microsite
  weed-town-square.html    Community plaza
  growing-lab.html         Plant care simulator
index.html                 Landing page hub
README.md                  You are here
```

## Roadmap & open tasks

Each page is still a prototype. The key follow-ups captured on the landing page roadmap include:

- **Live data integrations** – Connect the strain explorer to real dispensary inventory, lab results, and user accounts.
- **Hardware support** – Replace simulated scans with device camera access and QR validation for the review system.
- **Community moderation** – Add authentication, chat moderation tools, and verified vendor booths inside the town square.
- **Reservation flows** – Allow confirmed bookings and seasonal menus on the Harbor High microsite.
- **Advanced grow modeling** – Layer in hydroponic options, environmental analytics, and exportable grow logs.

If you extend the project, update both the relevant page and the roadmap notes so visitors know what is live versus planned.

## Contributing

Feel free to branch off, extend individual modules, or wire the mock data to real services. Keep accessibility, responsive
layout, and New York compliance in mind while iterating.
