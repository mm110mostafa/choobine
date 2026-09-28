/* =========================================================
   چوبینه - Main interactions
   ========================================================= */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const faDigits = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const faPrice = (n) => faDigits(n.toLocaleString('en-US'));

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
    spyNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  backTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Scroll spy ---------- */
  const spyLinks = $$('.nav-link, #mobile-bottom-menu a');
  const sections = $$('main section[id]');
  function spyNav() {
    let current = 'hero-section';
    sections.forEach((s) => { if (s.getBoundingClientRect().top < innerHeight * 0.35) current = s.id; });
    spyLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }

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

  /* Drawer submenu accordion */
  $$('.drawer-sub-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const li = btn.closest('.drawer-has-sub');
      const isOpen = li.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* ---------- Typed words in hero ---------- */
  const words = ['هدیه دهید', 'بیاورید', 'ماندگار کنید'];
  const typed = $('#typed-word');
  let wi = 0, ci = words[0].length, deleting = true;
  function typeLoop() {
    const w = words[wi];
    typed.textContent = w.slice(0, ci);
    let delay = deleting ? 60 : 110;
    if (deleting) { ci--; if (ci < 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0; delay = 300; } }
    else { ci++; if (ci > words[wi].length) { deleting = true; ci = words[wi].length; delay = 2200; } }
    setTimeout(typeLoop, delay);
  }
  setTimeout(typeLoop, 2500);

  /* ---------- Counters ---------- */
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, target = +el.dataset.count, dur = 1800, start = performance.now();
      (function step(now) {
        const k = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - k, 3);
        el.textContent = faDigits(Math.round(target * eased));
        if (k < 1) requestAnimationFrame(step);
      })(start);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$('[data-count]').forEach((el) => counterIO.observe(el));

  /* ---------- Products ---------- */
  const products = [
    { name: 'ساعت دیواری گردو', cat: 'wall', catFa: 'دکوراسیون دیواری', price: 1850000, old: 2200000, badge: 'پرفروش', img: 'images/product-1.jpg' },
    { name: 'دیوارکوب چوب طبیعی', cat: 'wall', catFa: 'دکوراسیون دیواری', price: 2400000, img: 'images/product-2.jpg' },
    { name: 'ست تخته سرو و قاشق', cat: 'kitchen', catFa: 'آشپزخانه', price: 980000, old: 1200000, badge: '۱۸٪ تخفیف', img: 'images/product-3.jpg' },
    { name: 'کاسه دست‌ساز گردو', cat: 'kitchen', catFa: 'آشپزخانه', price: 720000, img: 'images/product-4.jpg' },
    { name: 'جاشمعی چوبی سه‌تایی', cat: 'accessory', catFa: 'اکسسوری', price: 650000, badge: 'جدید', img: 'images/product-5.jpg' },
    { name: 'شلف دیواری لبه طبیعی', cat: 'wall', catFa: 'دکوراسیون دیواری', price: 1350000, img: 'images/product-6.jpg' },
    { name: 'ست قاشق و کفگیر زیتون', cat: 'kitchen', catFa: 'آشپزخانه', price: 540000, img: 'images/product-7.jpg' },
    { name: 'تندیس درخت زندگی', cat: 'accessory', catFa: 'اکسسوری', price: 1150000, old: 1400000, badge: 'ویژه', img: 'images/product-8.jpg' },
    { name: 'پایه نمایش سه طبقه', cat: 'accessory', catFa: 'اکسسوری', price: 890000, img: 'images/product-9.jpg' },
    { name: 'کاسه دکوری بلوط', cat: 'kitchen', catFa: 'آشپزخانه', price: 830000, img: 'images/product-10.jpg' }
  ];
  const wrap = $('#products-wrapper');
  function productHTML(p, i) {
    return '<article class="swiper-slide product-card" data-idx="' + i + '">' +
      '<div class="product-thumb">' +
        (p.badge ? '<span class="product-badge">' + p.badge + '</span>' : '') +
        '<div class="product-actions">' +
          '<button class="like-btn" aria-label="علاقه‌مندی"><i class="fa-regular fa-heart"></i></button>' +
          '<button class="view-btn" aria-label="مشاهده سریع"><i class="fa-regular fa-eye"></i></button>' +
        '</div>' +
        '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
      '</div>' +
      '<div class="product-body">' +
        '<span class="product-cat">' + p.catFa + '</span>' +
        '<h3>' + p.name + '</h3>' +
        '<div class="product-foot">' +
          '<div class="price">' + (p.old ? '<del>' + faPrice(p.old) + '</del>' : '') + faPrice(p.price) + ' <small>تومان</small></div>' +
          '<button class="add-cart" aria-label="افزودن به سبد"><i class="fa-solid fa-cart-plus"></i></button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  let productsSwiper;
  const productsOpts = {
    slidesPerView: 1.15, spaceBetween: 16, grabCursor: true,
    navigation: { nextEl: '.products-next', prevEl: '.products-prev' },
    pagination: { el: '.products-pagination', clickable: true },
    autoplay: { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true },
    breakpoints: { 576: { slidesPerView: 2 }, 992: { slidesPerView: 3, spaceBetween: 22 }, 1200: { slidesPerView: 4, spaceBetween: 24 } }
  };
  function renderProducts(filter) {
    wrap.innerHTML = products.map((p, i) => (filter === 'all' || p.cat === filter) ? productHTML(p, i) : '').join('');
    if (productsSwiper) productsSwiper.destroy(true, true);
    productsSwiper = new Swiper('.products-swiper', productsOpts);
  }
  renderProducts('all');

  $$('.filter-btn').forEach((b) => b.addEventListener('click', () => {
    $$('.filter-btn').forEach((x) => x.classList.remove('active'));
    b.classList.add('active');
    renderProducts(b.dataset.filter);
  }));

  wrap.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;
    const p = products[+card.dataset.idx];
    if (e.target.closest('.add-cart')) {
      window.Cart.add({ id: card.dataset.idx, name: p.name, img: p.img, price: p.price });
      toast('«' + p.name + '» به سبد خرید اضافه شد');
    } else if (e.target.closest('.like-btn')) {
      const btn = e.target.closest('.like-btn');
      btn.classList.toggle('liked');
      btn.innerHTML = btn.classList.contains('liked') ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
      toast(btn.classList.contains('liked') ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد');
    } else if (e.target.closest('.view-btn')) {
      openTour([{ src: p.img, cap: p.name + ' — ' + faPrice(p.price) + ' تومان' }]);
    }
  });

  /* ---------- Testimonials & Blog ---------- */
  new Swiper('.testimonials-swiper', {
    slidesPerView: 1, spaceBetween: 20, loop: true, grabCursor: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    pagination: { el: '.testimonials-pagination', clickable: true },
    breakpoints: { 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3, spaceBetween: 24 } }
  });
  new Swiper('.blog-swiper', {
    slidesPerView: 1.15, spaceBetween: 12, centeredSlides: true, loop: true, grabCursor: true,
    autoplay: { delay: 4500, disableOnInteraction: false },
    navigation: { nextEl: '.blog-next', prevEl: '.blog-prev' },
    breakpoints: { 768: { slidesPerView: 2.2, spaceBetween: 20 }, 1200: { slidesPerView: 3.6, spaceBetween: 24 } }
  });

  /* ---------- Projects accordion ---------- */
  const panels = $$('.project-panel');
  panels.forEach((p) => {
    const act = () => { panels.forEach((x) => x.classList.remove('active')); p.classList.add('active'); };
    p.addEventListener('mouseenter', act);
    p.addEventListener('click', act);
  });

  /* ---------- FAQ ---------- */
  $$('.faq-item').forEach((item) => {
    $('.faq-q', item).addEventListener('click', () => {
      const open = item.classList.contains('active');
      $$('.faq-item').forEach((x) => x.classList.remove('active'));
      if (!open) item.classList.add('active');
    });
  });

  /* ---------- Workshop tour modal (image slideshow) ---------- */
  const modal = $('#tour-modal'), stage = $('#tour-stage'), cap = $('#tour-caption');
  let tourTimer;
  const tourSlides = [
    { src: 'images/tour-1.jpg', cap: 'کارگاه چوبینه — انتخاب و آماده‌سازی چوب' },
    { src: 'images/about-main.jpg', cap: 'ساخت دست‌ساز توسط استادکاران' },
    { src: 'images/about-small.jpg', cap: 'کنده‌کاری و جزئیات ظریف' },
    { src: 'images/hero-main.jpg', cap: 'و در نهایت… خانه‌ای گرم و چوبی' }
  ];
  function openTour(slides) {
    let i = 0;
    stage.innerHTML = '';
    function show() {
      const img = new Image();
      img.src = slides[i].src; img.alt = slides[i].cap;
      stage.appendChild(img);
      requestAnimationFrame(() => img.classList.add('on'));
      cap.textContent = slides[i].cap;
      const old = stage.querySelectorAll('img');
      if (old.length > 2) old[0].remove();
      i = (i + 1) % slides.length;
    }
    show();
    clearInterval(tourTimer);
    if (slides.length > 1) tourTimer = setInterval(show, 3500);
    modal.classList.add('open');
  }
  function closeTour() { modal.classList.remove('open'); clearInterval(tourTimer); }
  $('#play-btn').addEventListener('click', () => openTour(tourSlides));
  $('#tour-close').addEventListener('click', closeTour);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeTour(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeTour(); toggleDrawer(false); } });

  /* ---------- Search ---------- */
  $('.header-search').addEventListener('submit', () => {
    const q = $('#header-search-input').value.trim();
    if (!q) return;
    const hit = products.findIndex((p) => p.name.includes(q));
    $('#products-section').scrollIntoView({ behavior: 'smooth' });
    if (hit > -1) { $$('.filter-btn')[0].click(); setTimeout(() => productsSwiper.slideTo(hit), 600); toast('نتیجه برای «' + q + '» پیدا شد'); }
    else toast('محصولی با «' + q + '» یافت نشد');
  });

  /* ---------- Contact form (saved via Table API) ---------- */
  $('#contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const data = { name: $('#contact-name').value.trim(), phone: $('#contact-phone').value.trim(), source: 'landing' };
    btn.disabled = true;
    try {
      const r = await fetch('tables/contact_requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error();
      toast('درخواست شما ثبت شد؛ به‌زودی تماس می‌گیریم 🌿');
      e.target.reset();
    } catch (err) {
      toast('خطا در ارسال؛ لطفاً دوباره تلاش کنید');
    }
    btn.disabled = false;
  });

  /* ---------- Libraries ---------- */
  if (window.AOS) AOS.init({ duration: 900, once: true, easing: 'ease-out-cubic', offset: 60 });
  if (window.VanillaTilt && matchMedia('(hover: hover)').matches) VanillaTilt.init($$('[data-tilt]'), { speed: 600, perspective: 1000 });

  onScroll();
})();
