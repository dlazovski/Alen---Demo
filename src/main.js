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

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const value = getByPath(dict, el.getAttribute('data-i18n-placeholder'));
    if (value !== null) el.setAttribute('placeholder', value);
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

function renderCompanyLists() {
  const listIds = ['companies-list', 'footer-companies-list'];
  listIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = companyNames.map((name) => `<li>${name}</li>`).join('');
  });
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

/* ---------- Application form ---------- */

function initForm() {
  const form = document.getElementById('application-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  function currentLang() {
    return document.documentElement.lang === 'en' ? 'en' : 'mk';
  }

  function clearErrors() {
    form.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));
    form.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));
  }

  function setError(fieldName, message) {
    const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
    if (errorEl) errorEl.textContent = message;
    const input = form.querySelector(`[name="${fieldName}"]`);
    if (input) input.classList.add('has-error');
  }

  function validate() {
    clearErrors();
    const dict = translations[currentLang()].form;
    let valid = true;
    const requiredFields = ['fullName', 'country', 'phone', 'email', 'age', 'trade', 'startDate'];

    requiredFields.forEach((name) => {
      const field = form.querySelector(`[name="${name}"]`);
      if (field && !field.value.trim()) {
        setError(name, dict.required);
        valid = false;
      }
    });

    const emailField = form.querySelector('[name="email"]');
    if (emailField && emailField.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
      setError('email', dict.required);
      valid = false;
    }

    const preferredChecked = form.querySelectorAll('[name="preferredCountries"]:checked');
    if (preferredChecked.length === 0) {
      setError('preferredCountries', dict.required);
      valid = false;
    }

    return valid;
  }

  // mock in-memory "endpoint"
  function mockSubmit(payload) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (payload.email && payload.fullName) {
          resolve({ ok: true });
        } else {
          reject(new Error('Invalid payload'));
        }
      }, 700);
    });
  }

  function showStatus(type) {
    const dict = translations[currentLang()].form;
    statusEl.hidden = false;
    statusEl.className = `form-status ${type}`;

    if (type === 'success') {
      statusEl.innerHTML = `
        <h3>${dict.successTitle}</h3>
        <p>${dict.successBody}</p>
        <button type="button" class="btn btn--outline" id="reset-form-btn">${dict.sendAnother}</button>
      `;
      form
        .querySelectorAll('input, select, textarea, button[type="submit"]')
        .forEach((el) => (el.hidden = true));
      form.querySelectorAll('label, legend, .form-row, .form-fieldset').forEach((el) => (el.hidden = true));
      document.getElementById('reset-form-btn').addEventListener('click', () => {
        form.reset();
        clearErrors();
        statusEl.hidden = true;
        form
          .querySelectorAll('input, select, textarea, button[type="submit"]')
          .forEach((el) => (el.hidden = false));
        form.querySelectorAll('label, legend, .form-row, .form-fieldset').forEach((el) => (el.hidden = false));
      });
    } else {
      statusEl.innerHTML = `<h3>${dict.errorTitle}</h3><p>${dict.errorBody}</p>`;
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    statusEl.hidden = true;

    if (!validate()) return;

    const formData = new FormData(form);
    const payload = {
      fullName: formData.get('fullName'),
      country: formData.get('country'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      age: formData.get('age'),
      trade: formData.get('trade'),
      experience: formData.get('experience'),
      preferredCountries: formData.getAll('preferredCountries'),
      startDate: formData.get('startDate'),
      message: formData.get('message'),
    };

    submitBtn.disabled = true;
    const dict = translations[currentLang()].form;
    const submitLabel = submitBtn.querySelector('span');
    const originalLabel = submitLabel.textContent;
    submitLabel.textContent = dict.submitting;

    try {
      await mockSubmit(payload);
      showStatus('success');
    } catch (err) {
      showStatus('error');
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = originalLabel;
    }
  });
}

/* ---------- Init ---------- */

document.addEventListener('DOMContentLoaded', () => {
  renderCompanyLists();
  initLangToggle();
  initRevealAnimations();
  initForm();
});
