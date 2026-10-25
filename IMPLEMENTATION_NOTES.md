# JTP Portfolio Implementation Notes

## Overview

This repository contains a responsive React/Vite implementation based on the supplied JTP Figma prototype screenshots. The page follows the Figma composition and interactions rather than reproducing the live JT+Partners website.

## Page Structure

- Featured project hero for Hilton Marjan Island Beach Resort & Spa.
- A fixed project rail with a vertical "Featured Projects" label, current/total counter, and an unconnected red scroll-progress marker.
- A white "Design the future Now" introduction section.
- A black expertise section with selectable Engineering, Architecture, and Interior Design tabs.
- An awards section with selectable award entries.
- A dark contact section with phone, email, social links, office labels, and footer wordmark.

The extra project hero screens were removed because their content was not present in the supplied Figma reference. The counter retains the Figma's four-project total, but only the Hilton project data is currently available in the app.

## Interactions and Motion

- GSAP and ScrollTrigger animate the project title out and reveal project details as the hero scrolls.
- The hero image scales and dims during the detail reveal.
- The red rail marker tracks document scroll progress without a connecting track.
- The rail marker repositions for the vertical desktop rail and the horizontal small-screen rail.
- Expertise and award tabs update their associated panel content.
- Hover and focus states are provided for interactive controls.
- Reduced-motion preferences are respected in CSS.

## Responsive Behavior

- At desktop/tablet widths, the project rail remains fixed vertically on the left.
- At widths of 600px and below, the rail becomes a compact horizontal top bar.
- Project sections, headings, facts, expertise panels, and contact details adapt to narrow screens without horizontal page overflow.

## Assets and Styling

- `public/images/hilton-marjan-hero.jpg` is the Hilton hero render used in the Figma reference.
- `public/images/hilton-marjan-architecture.webp` is used in the Architecture expertise panel.
- Jost is loaded from Google Fonts; a Helvetica fallback is configured.
- Lucide React supplies interface icons.

## Source Layout

- `src/App.jsx` contains the project data, page sections, tab state, rail behavior, and GSAP setup.
- `src/styles.css` contains the visual system, responsive layouts, rail styling, and reduced-motion rules.
- `src/main.jsx` mounts the React application.
- `index.html` provides the page title, metadata, and app root.
- `package.json` and `package-lock.json` define the Vite scripts and dependencies.

## Development

Requirements: Node.js and npm.

```powershell
npm install
npm run dev
```

Build and preview the production bundle:

```powershell
npm run build
npm run preview
```

## Content Follow-up

Only the Hilton hero and the displayed homepage sections could be matched to the screenshots provided. The remaining three featured-project hero screens and some expertise/award copy are not represented by verified Figma content and should be replaced when their source frames or copy are available.

## Verification

`npm run build` completed successfully during implementation. Desktop and mobile layouts were checked in the browser; the scroll marker and tab interactions were also exercised.