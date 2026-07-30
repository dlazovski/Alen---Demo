# Alen Services Group — Demo Website

A one-page bilingual (Macedonian / English) marketing site for Alen Services Group,
built as a client-facing demo. Mobile-first, single scrolling page, working
language toggle, and a call-to-apply phone contact section.

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
src/main.js       Language toggle, scroll-reveal animations, marquee, company list rendering
```

Translated strings live in `index.html` as `data-i18n="section.key"` attributes
(and `data-i18n-alt` for image alt text); `src/main.js` swaps `textContent` (or
the `alt` attribute) by reading the matching key out of `src/i18n.js`. No page
reload, no external i18n library. Language preference is stored in
`localStorage` and defaults to Macedonian.

## What's real vs. placeholder

This is a demo for feedback — several things are intentionally stubbed out:

- **Contact details** (phone, email, address in Izola) are placeholder text
  wrapped in brackets, e.g. `[Телефонски број]`. Needs real company contact
  info before launch.
- **Applying is call-to-apply, not a form.** The "Apply" section shows a
  phone number placeholder (`[+386 XX XXX XXX]`) instead of a multi-field
  form — replace the placeholder text and the `href="tel:"` link in
  `index.html` with the real number once it's available.
- **Photography is client-supplied, not stock.** The hero photo
  (`public/images/uploads/alen-1.jpg`), the "for workers" banner
  (`public/images/uploads/alen-2.jpg`), and the "for companies" banner
  (`public/images/uploads/alen-logo.webp`) were provided directly by the
  client and used as-is. Note that visually these lean much more staged/promotional
  than the rest of the site's editorial tone — worth a second look before
  this goes to the client for final sign-off. The workers-banner frame
  (`.photo-banner--workers` in `src/style.css`) was narrowed to a portrait
  aspect ratio (1201:2000) to match `alen-2.jpg`'s native orientation instead
  of cropping it into the old wide banner shape. The companies-banner logo
  graphic uses `object-fit: contain` on a navy background
  (`.photo-banner--contain`) rather than `cover`, since it's a text-bearing
  graphic, not a croppable photo. To swap any of the three, replace the file
  under `public/images/uploads/` (or update the `src` in `index.html`) —
  keep an eye on the frame's `aspect-ratio` in `src/style.css` if the
  replacement's proportions differ meaningfully. No logos are included for
  the four companies themselves, per the brief (they don't exist yet).
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
