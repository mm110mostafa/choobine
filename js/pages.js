/* =========================================================
   چوبینه - Inner pages shared interactions (RTL)
   ========================================================= */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const faDigits = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const themeBtn = $('#theme-toggle');
  function applyTheme(mode) {
    root.classList.toggle('theme-dark', mode === 'dark');
    themeBtn.innerHTML = mode === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }
  applyTheme(localStorage.getItem('choob_theme') || 'light');
  themeBtn.addEventListener('click', () => {
    const next = root.classList.contains('theme-dark') ? 'light' : 'dark';
    localStorage.setItem('choob_theme', next);
    applyTheme(next);
  });

  /* ---------- Preloader ---------- */
  window.addEventListener('load', () => setTimeout(() => $('#preloader').classList.add('hidden'), 350));
  setTimeout(() => $('#preloader').classList.add('hidden'), 3500);

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------- Header / scroll ---------- */
  const header = $('#site-header');
  const progress = $('#scroll-progress');
  const backTop = $('#back-to-top');
  const circle = $('#back-to-top circle');
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? y / max : 0;
    progress.style.width = (p * 100) + '%';
    circle.style.strokeDashoffset = 126 - 126 * p;
    header.classList.toggle('scrolled', y > 40);
    header.classList.toggle('hide', y > 500 && y > lastY && !document.body.classList.contains('drawer-open'));
    backTop.classList.toggle('show', y > 600);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  backTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));


  /* ---------- Mobile drawer ---------- */
  const drawer = $('#mobile-drawer'), overlay = $('#drawer-overlay');
  $$('.drawer-list > li').forEach((li, i) => li.style.setProperty('--i', i));
  function toggleDrawer(open) {
    drawer.classList.toggle('open', open);
    overlay.classList.toggle('show', open);
    document.body.classList.toggle('drawer-open', open);
  }
  $('#menu-toggle').addEventListener('click', () => toggleDrawer(true));
  $('#drawer-close').addEventListener('click', () => toggleDrawer(false));
  overlay.addEventListener('click', () => toggleDrawer(false));
  $$('#mobile-drawer a').forEach((a) => a.addEventListener('click', () => toggleDrawer(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleDrawer(false); });

  /* Drawer submenu accordion */
  $$('.drawer-sub-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const li = btn.closest('.drawer-has-sub');
      const isOpen = li.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* ---------- Cart (managed by js/cart.js) ---------- */
  /* دکمه سبد و بجِ شمارنده توسط cart.js متصل می‌شوند؛ اینجا فقط همگام‌سازی اولیه. */

  /* ---------- Header search (redirect to homepage products) ---------- */
  const searchForm = $('.header-search');
  if (searchForm) {
    searchForm.addEventListener('submit', () => {
      const q = $('#header-search-input').value.trim();
      if (q) window.location.href = '../index.html#products-section';
    });
  }

  /* ---------- Animated counters (page stats) ---------- */
  function animateCount(el) {
    const target = Number(el.dataset.count) || 0;
    const dur = 1400, t0 = performance.now();
    function tick(now) {
      const k = Math.min((now - t0) / dur, 1);
      el.textContent = faDigits(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const counters = $$('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { animateCount(en.target); io.unobserve(en.target); } });
    }, { threshold: .4 });
    counters.forEach((c) => io.observe(c));
  } else counters.forEach(animateCount);

  /* ---------- FAQ accordion ---------- */
  $$('.faq-item').forEach((item) => {
    $('.faq-q', item).addEventListener('click', () => {
      const open = item.classList.contains('active');
      $$('.faq-item').forEach((x) => x.classList.remove('active'));
      if (!open) item.classList.add('active');
    });
  });

  /* ---------- Forms (contact page + projects CTA) ---------- */
  async function sendForm(form, data) {
    const btn = form.querySelector('button');
    btn.disabled = true;
    try {
      const r = await fetch('/tables/contact_requests', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      });
      if (!r.ok) throw new Error();
      toast('درخواست شما ثبت شد؛ به‌زودی تماس می‌گیریم 🌿');
      form.reset();
    } catch (err) {
      toast('خطا در ارسال؛ لطفاً دوباره تلاش کنید');
    }
    btn.disabled = false;
  }

  const contactForm = $('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendForm(contactForm, {
        name: $('#contact-name').value.trim(),
        phone: $('#contact-phone').value.trim(),
        subject: ($('#contact-subject') || {}).value || '',
        message: ($('#contact-message') || {}).value || '',
        source: 'contact-page'
      });
    });
  }
  const quickForm = $('#quick-form');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendForm(quickForm, {
        name: $('#contact-name').value.trim(),
        phone: $('#contact-phone').value.trim(),
        subject: quickForm.dataset.subject || 'درخواست مشاوره',
        source: quickForm.dataset.source || 'inner-page'
      });
    });
  }
  const newsForm = $('#newsletter-form');
  if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      toast('ایمیل شما در خبرنامه ثبت شد؛ منتظر مقالات بعدی باشید 🌿');
      newsForm.reset();
    });
  }

  /* ---------- Blog grid filter ---------- */
  const blogGrid = $('#blog-grid');
  if (blogGrid) {
    $$('.filter-btn').forEach((b) => b.addEventListener('click', () => {
      $$('.filter-btn').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      const f = b.dataset.cat;
      $$('.blog-card', blogGrid).forEach((c) => {
        c.classList.toggle('hide', f !== 'all' && c.dataset.cat !== f);
      });
    }));
  }

  /* ---------- Libraries ---------- */
  if (window.AOS) AOS.init({ duration: 900, once: true, easing: 'ease-out-cubic', offset: 60 });

  onScroll();
})();
