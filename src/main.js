import './style.css';
import { translations, companyNames, marqueeMarkets } from './i18n.js';

const STORAGE_KEY = 'alen-lang';

/* ---------- Language handling ---------- */

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
}

function applyTranslations(lang) {
  const dict = translations[lang];

  document.documentElement.lang = lang;
  document.title = getByPath(dict, 'meta.title') || document.title;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = getByPath(dict, el.getAttribute('data-i18n'));
    if (value !== null) el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const value = getByPath(dict, el.getAttribute('data-i18n-alt'));
    if (value !== null) el.setAttribute('alt', value);
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    const isActive = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });

  const langToggle = document.querySelector('.lang-toggle');
  if (langToggle) langToggle.setAttribute('data-active-lang', lang);

  renderMarquee(lang);
}

function setLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
  applyTranslations(lang);
}

function initLangToggle() {
  const stored = localStorage.getItem(STORAGE_KEY);
  const initialLang = stored === 'en' ? 'en' : 'mk';
  applyTranslations(initialLang);

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
  });
}

/* ---------- Marquee ---------- */

function renderMarquee(lang) {
  const items = marqueeMarkets[lang] || marqueeMarkets.mk;
  const markup = items.map((item) => `<li>${item}</li>`).join('');
  ['marquee-list-a', 'marquee-list-b'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = markup;
  });
}

/* ---------- Company lists ---------- */

const CARD_LINE_BREAKS = {
  'Kompanii za vrabotuvanje International d.o.o.': 'Kompanii za vrabotuvanje<span class="company-name__break">International d.o.o.</span>',
};

function renderCompanyLists() {
  const aboutEl = document.getElementById('companies-list');
  if (aboutEl) {
    aboutEl.innerHTML = companyNames
      .map((name) => `<li>${CARD_LINE_BREAKS[name] || name}</li>`)
      .join('');
  }

  const footerEl = document.getElementById('footer-companies-list');
  if (footerEl) {
    footerEl.innerHTML = companyNames.map((name) => `<li>${name}</li>`).join('');
  }
}

/* ---------- Scroll reveal ---------- */

function initRevealAnimations() {
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach((t) => observer.observe(t));
}

/* ---------- Init ---------- */

document.addEventListener('DOMContentLoaded', () => {
  renderCompanyLists();
  initLangToggle();
  initRevealAnimations();
});
