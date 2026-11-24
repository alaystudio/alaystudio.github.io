// Game pages: show one language (the same choice as the home page, key 'alay.lang'); both are in the HTML.
(() => {
  const root = document.documentElement;
  let lang = '';
  try { lang = localStorage.getItem('alay.lang') || ''; } catch (e) { lang = ''; }
  if (lang !== 'en' && lang !== 'tr') lang = (navigator.language || 'en').toLowerCase().startsWith('tr') ? 'tr' : 'en';
  const btn = document.getElementById('lang');
  function apply() {
    root.dataset.lang = lang;
    root.lang = lang;
    btn.textContent = lang === 'en' ? 'TR' : 'EN';
    btn.setAttribute('aria-label', lang === 'en' ? 'Türkçe' : 'English');
    const t = document.querySelector(`meta[name="title-${lang}"]`);
    if (t) document.title = t.content;
  }
  btn.addEventListener('click', () => {
    lang = lang === 'en' ? 'tr' : 'en';
    try { localStorage.setItem('alay.lang', lang); } catch (e) { /* storage blocked */ }
    apply();
  });
  apply();
})();
