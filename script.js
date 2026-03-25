/* ═══════════════════════════════════════════════════════
   CTF WRITEUPS — Shared Script
   ═══════════════════════════════════════════════════════ */

/* ── Theme Toggle ─────────────────────────────────────── */
(function () {
  const saved = localStorage.getItem('ctf-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ctf-theme', next);
  });
}

/* ── Active Nav Link ──────────────────────────────────── */
function initActiveNav() {
  const page = location.pathname.split('/').pop() || 'home.html';
  document.querySelectorAll('.topnav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'home.html')) {
      a.classList.add('active');
    }
  });
}

/* ── Copy Code Button ─────────────────────────────────── */
function copyCode(btn) {
  const pre = btn.closest('.code-block').querySelector('pre');
  navigator.clipboard.writeText(pre.innerText).then(() => {
    btn.textContent = 'COPIED!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'COPY'; btn.classList.remove('copied'); }, 1800);
  });
}

/* ── Flag Scramble Animation ──────────────────────────── */
function initFlagScramble() {
  const el = document.getElementById('flag-text');
  if (!el) return;
  const final = el.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}_ ';
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let step = 0;
      const total = final.length;
      const interval = setInterval(() => {
        if (step >= total) { el.textContent = final; clearInterval(interval); return; }
        el.textContent = final.split('').map((c, i) =>
          i < step ? c : chars[Math.floor(Math.random() * chars.length)]
        ).join('');
        step += 2;
      }, 40);
    });
  }, { threshold: 0.5 });
  obs.observe(el);
}

/* ── Scroll Fade-in ───────────────────────────────────── */
function initScrollFade() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.section, .fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity .45s ease, transform .45s ease';
    observer.observe(el);
  });
}

/* ── Writeup Filter (writeups.html & categories.html) ── */
function initFilter() {
  const catChips  = document.querySelectorAll('.chip[data-cat]');
  const diffChips = document.querySelectorAll('.chip[data-diff]');
  const cards     = document.querySelectorAll('.card[data-cat]');
  const countEl   = document.getElementById('filter-count');
  const noResults = document.querySelector('.no-results');

  if (!catChips.length && !diffChips.length) return;

  let activeCats  = new Set();
  let activeDiffs = new Set();

  function applyFilter() {
    let visible = 0;
    cards.forEach(card => {
      const cat  = (card.dataset.cat  || '').toUpperCase();
      const diff = (card.dataset.diff || '').toUpperCase();
      const catOk  = activeCats.size  === 0 || activeCats.has(cat);
      const diffOk = activeDiffs.size === 0 || activeDiffs.has(diff);
      const show = catOk && diffOk;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (countEl) countEl.textContent = `${visible} writeup${visible !== 1 ? 's' : ''}`;
    if (noResults) noResults.classList.toggle('visible', visible === 0);
  }

  catChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.dataset.cat.toUpperCase();
      if (activeCats.has(val)) { activeCats.delete(val); chip.classList.remove('active'); }
      else                     { activeCats.add(val);    chip.classList.add('active'); }
      applyFilter();
    });
  });

  diffChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.dataset.diff.toUpperCase();
      if (activeDiffs.has(val)) { activeDiffs.delete(val); chip.classList.remove('active'); }
      else                      { activeDiffs.add(val);    chip.classList.add('active'); }
      applyFilter();
    });
  });

  // init count
  if (countEl) countEl.textContent = `${cards.length} writeups`;
}

/* ── Init All ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initActiveNav();
  initFlagScramble();
  initScrollFade();
  initFilter();
});
