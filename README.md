# Alen Services Group — Demo Website

A one-page bilingual (Macedonian / English) marketing site for Alen Services Group,
built as a client-facing demo. Mobile-first, single scrolling page, working
language toggle, and a mock application form.

## Running locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

This starts a Vite dev server on `http://localhost:5173`.

### Viewing on a phone (same Wi-Fi)

The dev server is already configured to listen on your local network
(`host: 0.0.0.0` in `vite.config.js`). After running `npm run dev`, the
terminal prints a **Network** URL, e.g.:

```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.23:5173/
```

Open that **Network** address on a phone connected to the same Wi-Fi network
as your computer. If it doesn't load, check that your computer's firewall
allows incoming connections on port 5173.

### Production build

```bash
npm run build      # outputs static files to dist/
npm run preview    # serves the production build locally for a final check
```

## Project structure

```
index.html        Page markup (semantic HTML, data-i18n attributes for translated text)
src/style.css     All styling — mobile-first, with tablet/desktop breakpoints
src/i18n.js       Macedonian + English copy, keyed by section
src/main.js       Language toggle, scroll-reveal animations, form handling
```

Translated strings live in `index.html` as `data-i18n="section.key"` attributes;
`src/main.js` swaps `textContent` (and `placeholder` for inputs) by reading the
matching key out of `src/i18n.js`. No page reload, no external i18n library.
Language preference is stored in `localStorage` and defaults to Macedonian.

## What's real vs. placeholder

This is a demo for feedback — several things are intentionally stubbed out:

- **Contact details** (phone, email, address in Izola) are placeholder text
  wrapped in brackets, e.g. `[Телефонски број]`. Needs real company contact
  info before launch.
- **Application form submission** is a mock, in-memory handler (see
  `mockSubmit` in `src/main.js`). It simulates a network request and always
  succeeds if the required fields are filled in. It does **not** send email,
  hit a real API, or persist data anywhere. A real backend/endpoint (or a
  service like Formspree/Netlify Forms) needs to be wired in before launch.
- **Photography is placeholder artwork, not real photos.** This build environment
  has no internet access, so real stock/company photography could not be
  sourced. Instead, `public/images/hero-placeholder.svg`,
  `public/images/workers-banner.svg`, and `public/images/companies-banner.svg`
  are custom-built duotone/gradient graphics in the brand palette, each
  carrying a visible "Photo — placeholder" tag so it reads as intentional,
  not broken. **To swap in real photography:** replace the file at each path
  (keep the same filename, or update the `src` in `index.html`) with a real
  photo at a similar aspect ratio — hero ≈ 4:4.6 portrait, workers banner ≈
  16:10 landscape, companies banner ≈ 4:3 — and remove the corresponding
  `<span class="photo-tag">` element once real photography is in place. No
  logos are included for the four companies, per the brief (they don't exist
  yet).
- **Copy is a first editorial pass**, translated and lightly polished from
  the client's raw material. It has **not** been reviewed by a professional
  Macedonian translator/copyeditor — recommend a native-speaker pass before
  this goes live, especially for the legal/visa language.
- **Privacy policy / Terms links** in the footer are placeholder anchors
  (`#`) — real pages need to be written and linked.

## Design notes

- Typography: Cormorant Garamond (serif, headlines) + Inter (sans, body),
  loaded from Google Fonts.
- Palette: warm off-white background, deep navy text/sections, muted ochre
  accent — see CSS custom properties at the top of `src/style.css`.
- Layout takes cues from Deel/Randstad-style corporate marketing sites: an
  asymmetric hero with an organic "blob"-masked photo panel and a floating
  stat card, a pill-shaped segmented language switcher, fully rounded (pill)
  buttons, an infinite-scroll marquee of destination markets, icon-badge
  cards, and photo banners inside the "for workers" / "for companies"
  sections — instead of a flat, generic stacked-rectangle layout.
- Scroll-reveal fade-ins use `IntersectionObserver` and respect
  `prefers-reduced-motion`; the marquee animation also pauses under that
  setting and on hover.
- No external JS dependencies beyond Vite itself (dev-only) — the shipped
  site is plain HTML/CSS/JS.
