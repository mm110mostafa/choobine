/* =========================================================
   چوبینه - Cart drawer (shared, localStorage based, RTL)
   ========================================================= */
(function () {
  'use strict';
  if (window.Cart) return; /* guard against double load */

  const faDigits = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const faPrice = (n) => faDigits(Math.round(Number(n) || 0).toLocaleString('en-US'));
  const KEY = 'choob_cart_items';
  const FREE_SHIPPING = 5000000; /* سقف ارسال رایگان */
  const SHIPPING_COST = 75000;   /* هزینه ارسال عادی */
  const $ = (s, c = document) => c.querySelector(s);

  /* صفحات داخلی در /pages/ هستند → آدرس تصاویر به ../ نیاز دارد */
  const imgBase = /\/pages\//.test(location.pathname.replace(/\\/g, '/')) ? '../' : '';

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr.filter((it) => it && it.id != null);
      }
    } catch (e) {}
    return [];
  }
  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }

  let items = load();

  /* ---------- ساخت کشوی سبد خرید ---------- */
  const overlay = document.createElement('div');
  overlay.id = 'cart-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML =
    '<aside class="cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-label="سبد خرید چوبینه">' +
      '<div class="cart-head">' +
        '<div class="cart-title"><i class="fa-solid fa-bag-shopping"></i><span>سبد خرید</span><span class="cart-badge" id="cart-badge">۰</span></div>' +
        '<button class="cart-close" id="cart-close" aria-label="بستن سبد خرید"><i class="fa-solid fa-xmark"></i></button>' +
      '</div>' +
      '<div class="cart-shipping">' +
        '<p class="cart-shipping-text"><i class="fa-solid fa-truck-fast"></i><span id="cart-shipping-text"></span></p>' +
        '<div class="cart-shipping-bar" id="cart-shipping-bar"><span id="cart-shipping-fill"></span></div>' +
      '</div>' +
      '<div class="cart-body" id="cart-body"></div>' +
      '<div class="cart-foot">' +
        '<div class="cart-line"><span>جمع کالاها</span><b id="cart-subtotal">۰ <small>تومان</small></b></div>' +
        '<div class="cart-line"><span>هزینه ارسال</span><b id="cart-shipping-cost">رایگان</b></div>' +
        '<div class="cart-line total"><span>مبلغ قابل پرداخت</span><b id="cart-total">۰ <small>تومان</small></b></div>' +
        '<button class="btn btn-primary cart-checkout" id="cart-checkout"><span>ادامه فرآیند خرید</span><span class="btn-arrow"><i class="fa-solid fa-arrow-left-long"></i></span></button>' +
        '<div class="cart-trust">' +
          '<span><i class="fa-solid fa-shield-halved"></i> پرداخت امن</span>' +
          '<span><i class="fa-solid fa-truck"></i> ارسال سریع</span>' +
          '<span><i class="fa-solid fa-rotate-left"></i> ضمانت بازگشت کالا</span>' +
        '</div>' +
      '</div>' +
    '</aside>';
  document.body.appendChild(overlay);

  const drawer = $('#cart-drawer');
  const body = $('#cart-body');
  const badge = $('#cart-badge');

  /* ---------- Toast (از المان مشترک سایت استفاده می‌کند) ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------- محاسبات ---------- */
  function count() { return items.reduce((s, it) => s + (it.qty || 0), 0); }
  function total() { return items.reduce((s, it) => s + (it.qty || 0) * (it.price || 0), 0); }

  function bumpBadge() {
    const cc = $('#cart-count');
    if (!cc) return;
    cc.classList.remove('bump'); void cc.offsetWidth; cc.classList.add('bump');
  }

  function updateBadge() {
    const txt = faDigits(count());
    badge.textContent = txt;
    const cc = $('#cart-count');
    if (cc) cc.textContent = txt;
  }
  /* ---------- رندر کردن محتوای سبد ---------- */
  function render() {
    updateBadge();
    const t = total();
    drawer.classList.toggle('empty', items.length === 0);

    if (!items.length) {
      body.innerHTML =
        '<div class="cart-empty">' +
          '<div class="empty-ico"><i class="fa-solid fa-basket-shopping"></i></div>' +
          '<h4>سبد خرید شما خالی است</h4>' +
          '<p>هنوز محصولی به سبد خرید اضافه نکرده‌اید. محصولات دست‌ساز چوبینه را ببینید!</p>' +
          '<a href="' + imgBase + 'index.html#products-section" class="btn btn-primary cart-shop-btn">' +
            '<i class="fa-solid fa-grip"></i><span>مشاهده محصولات</span>' +
          '</a>' +
        '</div>';
    } else {
      body.innerHTML = items.map((it, i) =>
        '<div class="cart-item" data-id="' + it.id + '" style="--i:' + i + '">' +
          '<img src="' + String(it.img || '').replace(/^images\//, imgBase + 'images/') + '" alt="' + (it.name || '') + '" loading="lazy">' +
          '<div class="cart-item-info">' +
            '<h4>' + (it.name || 'محصول چوبی') + '</h4>' +
            '<span class="cart-item-unit">' + faPrice(it.price) + ' تومان</span>' +
            '<div class="cart-qty">' +
              '<button class="qty-down" aria-label="کاهش تعداد"><i class="fa-solid fa-minus"></i></button>' +
              '<span>' + faDigits(it.qty) + '</span>' +
              '<button class="qty-up" aria-label="افزایش تعداد"><i class="fa-solid fa-plus"></i></button>' +
            '</div>' +
          '</div>' +
          '<div class="cart-item-side">' +
            '<button class="cart-remove" aria-label="حذف از سبد خرید"><i class="fa-regular fa-trash-can"></i></button>' +
            '<span class="cart-item-total">' + faPrice((it.qty || 0) * (it.price || 0)) + '</span>' +
          '</div>' +
        '</div>'
      ).join('');
    }

    /* فاکتور */
    const free = t >= FREE_SHIPPING;
    const ship = free ? 0 : SHIPPING_COST;
    $('#cart-subtotal').innerHTML = faPrice(t) + ' <small>تومان</small>';
    $('#cart-shipping-cost').innerHTML = free ? 'رایگان' : faPrice(SHIPPING_COST) + ' <small>تومان</small>';
    $('#cart-total').innerHTML = faPrice(t + ship) + ' <small>تومان</small>';

    /* نوار پیشرفت ارسال رایگان */
    $('#cart-shipping-fill').style.width = Math.min(100, Math.round((t / FREE_SHIPPING) * 100)) + '%';
    $('#cart-shipping-bar').classList.toggle('full', free);
    $('#cart-shipping-text').textContent = free
      ? 'ارسال این سفارش روی چوبینه رایگان است!'
      : 'با ' + faPrice(FREE_SHIPPING - t) + ' تومان خرید بیشتر، ارسال رایگان هدیه بگیرید';
  }

  /* ---------- باز و بسته کردن ---------- */
  let isOpen = false;
  function open() {
    if (isOpen) return;
    isOpen = true;
    render();
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
    document.body.style.overflow = '';
  }
  function toggle() { isOpen ? close() : open(); }

  /* ---------- تغییرات سبد ---------- */
  function add(product) {
    if (!product || product.id == null) return;
    const id = String(product.id);
    const found = items.find((x) => String(x.id) === id);
    if (found) found.qty++;
    else items.push({
      id: id,
      name: product.name || 'محصول چوبی',
      img: product.img || '',
      price: product.price || 0,
      qty: 1
    });
    save(items);
    render();
    bumpBadge();
  }

  function changeQty(id, delta) {
    const it = items.find((x) => String(x.id) === String(id));
    if (!it) return;
    it.qty += delta;
    if (it.qty < 1) {
      items = items.filter((x) => String(x.id) !== String(id));
      toast('کالا از سبد خرید حذف شد');
    }
    save(items);
    render();
  }

  function removeItem(id) {
    items = items.filter((x) => String(x.id) !== String(id));
    save(items);
    render();
    toast('کالا از سبد خرید حذف شد');
  }

  function clear() {
    items = [];
    save(items);
    render();
  }

  /* ---------- رویدادها ---------- */
  const cartBtn = $('#cart-button');
  if (cartBtn) cartBtn.addEventListener('click', (e) => { e.preventDefault(); toggle(); });

  $('#cart-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) close(); });

  body.addEventListener('click', (e) => {
    if (e.target.closest('.cart-shop-btn')) { close(); return; }
    const item = e.target.closest('.cart-item');
    if (!item) return;
    const id = item.dataset.id;
    if (e.target.closest('.qty-up')) changeQty(id, 1);
    else if (e.target.closest('.qty-down')) changeQty(id, -1);
    else if (e.target.closest('.cart-remove')) removeItem(id);
  });

  $('#cart-checkout').addEventListener('click', () => {
    if (!items.length) return;
    toast('سفارش شما ثبت شد 🌿 همکاران ما برای هماهنگی ارسال با شما تماس می‌گیرند');
    clear();
    close();
  });

  /* همگام‌سازی بین تب‌های مرورگر */
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) { items = load(); render(); }
  });

  /* ---------- رابط عمومی ---------- */
  window.Cart = {
    get items() { return items; },
    count: count,
    total: total,
    add: add,
    remove: removeItem,
    inc: (id) => changeQty(id, 1),
    dec: (id) => changeQty(id, -1),
    clear: clear,
    open: open,
    close: close,
    toggle: toggle,
    render: render
  };

  render();
})();


