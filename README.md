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
- **No photography** — the brief explicitly asked for no stock photos of
  workers and no placeholder logos for the four companies (they don't exist
  yet). The design is intentionally content-forward and photo-free. If the
  client wants photography later, hero and "for workers" sections are the
  natural spots to introduce it.
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
- Scroll-reveal fade-ins use `IntersectionObserver` and respect
  `prefers-reduced-motion`.
- No external JS dependencies beyond Vite itself (dev-only) — the shipped
  site is plain HTML/CSS/JS.
