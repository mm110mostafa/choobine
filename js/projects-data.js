/* =========================================================
   چوبینه - داده‌های نمونه‌کارها و رندر گالری + لایت‌باکس
   ========================================================= */

const PROJECTS = [
  { id: 1, title: "ویلای جنگلی لواسان", cat: "residential", catName: "مسکونی", year: "۱۴۰۴",
    img: "../images/project-1.jpg", area: "۲۴۰ مترمربع", wood: "چوب راش و گردو",
    desc: "طراحی و اجرای کامل دکوراسیون چوبی یک ویلای خصوصی؛ شامل شومینه چوبی، شلف‌های کف تا سقف و پنجره‌های چوبی دوجداره." },
  { id: 2, title: "هتل بوتیک چوب‌سرا", cat: "commercial", catName: "تجاری", year: "۱۴۰۴",
    img: "../images/project-2.jpg", area: "۱۲۰۰ مترمربع", wood: "چوب بلوط",
    desc: "اجرای لابی، رستوران و ۲۲ اتاق هتل با متریال طبیعی و نورپردازی گرم برای تجربه‌ای آرامش‌بخش برای مهمانان." },
  { id: 3, title: "کارگاه تولید ظروف چوبی", cat: "industrial", catName: "صنعتی", year: "۱۴۰۳",
    img: "../images/project-3.jpg", area: "۸۵۰ مترمربع", wood: "چوب صنوبر",
    desc: "طراحی کارگاه تولید با میزهای کار سفارشی، سیستم تهویه و قفسه‌های انبار چوبی مقاوم با قابلیت جابه‌جایی." },
  { id: 4, title: "آپارتمان مدرن نیاوران", cat: "residential", catName: "مسکونی", year: "۱۴۰۴",
    img: "../images/project-4.jpg", area: "۱۸۰ مترمربع", wood: "چوب فینگرجوینت",
    desc: "دکوراسیون مینیمال آشپزخانه باز، سرمه‌رطوبتی چوبی و دیوارکوب‌های هنری هماهنگ با سبک زندگی خانواده جوان." },
  { id: 5, title: "کافه رستوران چوبینه", cat: "commercial", catName: "تجاری", year: "۱۴۰۳",
    img: "../images/tour-1.jpg", area: "۳۲۰ مترمربع", wood: "چوب کهنه و فلز",
    desc: "فضای صنعتی-روستیک با میزهای یکپارچه چوبی، چراغ‌های حصیری و بار چوبی دوبلکس برای کافه‌ای پراز مشتری." },
  { id: 6, title: "مجموعه اداری آسایش", cat: "commercial", catName: "تجاری", year: "۱۴۰۲",
    img: "../images/blog-1.jpg", area: "۵۶۰ مترمربع", wood: "چوب MDF روکش طبیعی",
    desc: "طراحی میزهای کار ارگونومیک، اتاق جلسات با آکوستیک چوبی و دیواره‌های شیشه‌ای چوب‌قاب برای دفتری حرفه‌ای." },
  { id: 7, title: "کلبه کوهستانی درزک", cat: "residential", catName: "مسکونی", year: "۱۴۰۳",
    img: "../images/blog-2.jpg", area: "۹۵ مترمربع", wood: "چوب کاج و راش",
    desc: "بازسازی کامل کلبه‌ای کوهستانی با سقف چوبی شیب‌دار، شومیشه سنگی و مبلمان توکار گرم و صمیمی." },
  { id: 8, title: "فروشگاه زنجیره‌ای چوبینه", cat: "commercial", catName: "تجاری", year: "۱۴۰۴",
    img: "../images/blog-3.jpg", area: "۲۱۰ مترمربع", wood: "چوب گردو و آینه",
    desc: "طراحی ویترین، استندهای نمایش محصول و پیشخوان فروشگاه با ترکیب چوب و آینه برای نمایش بهتر محصولات." },
  { id: 9, title: "کارگاه نجاری صنعتی الوند", cat: "industrial", catName: "صنعتی", year: "۱۴۰۲",
    img: "../images/blog-4.jpg", area: "۱۴۰۰ مترمربع", wood: "چوب ممرز",
    desc: "بهینه‌سازی خط تولید با میزهای مونتاژ سفارشی، مسیرهای حرکتی ایمن و انبار چوب با کنترل رطوبت." },
  { id: 10, title: "ویلای حیاط مرکزی کاشان", cat: "residential", catName: "مسکونی", year: "۱۴۰۱",
    img: "../images/blog-5.jpg", area: "۴۲۰ مترمربع", wood: "چوب آبنوس و فینگر",
    desc: "ترمیم و طراحی حیاط مرکزی خانه سنتی با الطاقچه‌های چوبی، پنجره‌های ارسی و مبلمان حیاط گنجینه‌ای." },
  { id: 11, title: "ویلای ساحلی متل‌قو", cat: "residential", catName: "مسکونی", year: "۱۴۰۴",
    img: "../images/video-poster.jpg", area: "۳۱۰ مترمربع", wood: "چوب سفید و راش",
    desc: "طراحی ویلای ساحلی با کرکره‌های چوبی آفتاب‌گیر، نیمکت‌های پاسیو و فضای باز برای دیدن دریای شمال." },
  { id: 12, title: "موزه مجسمه چوبی", cat: "commercial", catName: "تجاری", year: "۱۴۰۳",
    img: "../images/product-1.jpg", area: "۲۸۰ مترمربع", wood: "چوب گردو و ممرز",
    desc: "طراحی گالری و موزه مجسمه‌های چوبی با نورپردازی نقطه‌ای روی استندهای سفارشی و دیوارهای خنثی." }
];


(function () {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCap = document.getElementById("lb-cap");
  const emptyMsg = document.getElementById("empty-msg");
  let visible = [];
  let current = 0;

  const cardHTML = p => `
    <article class="p-card" data-cat="${p.cat}">
      <div class="p-img">
        <span class="p-cat">${p.catName}</span>
        <span class="p-year">${p.year}</span>
        <img src="${p.img}" alt="${p.title}" loading="lazy">
        <button class="p-view" data-id="${p.id}" aria-label="مشاهده ${p.title}"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
      </div>
      <div class="p-body">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="p-meta">
          <span><i class="fa-solid fa-ruler-combined"></i> ${p.area}</span>
          <span><i class="fa-solid fa-tree"></i> ${p.wood}</span>
        </div>
      </div>
    </article>`;

  function render(list) {
    grid.innerHTML = list.map(cardHTML).join("");
    visible = list;
    emptyMsg.hidden = list.length > 0;
    grid.querySelectorAll(".p-card").forEach((c, i) => {
      c.style.animationDelay = (i * 60) + "ms";
    });
  }

  render(PROJECTS);

  /* ---- Filtering ---- */
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      render(f === "all" ? PROJECTS : PROJECTS.filter(p => p.cat === f));
    });
  });

  /* ---- Lightbox ---- */
  function openLB(id) {
    current = visible.findIndex(p => p.id === id);
    if (current < 0) current = 0;
    showLB();
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function showLB() {
    const p = visible[current];
    lbImg.src = p.img;
    lbImg.alt = p.title;
    lbCap.innerHTML = `<strong>${p.title}</strong> — ${p.catName} · ${p.year} · ${p.area} · ${p.wood}`;
  }
  function closeLB() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
  function step(dir) {
    if (!visible.length) return;
    current = (current + dir + visible.length) % visible.length;
    showLB();
  }

  grid.addEventListener("click", e => {
    const b = e.target.closest(".p-view");
    if (b) openLB(Number(b.dataset.id));
  });

  document.getElementById("lb-close").addEventListener("click", closeLB);
  document.getElementById("lb-prev").addEventListener("click", () => step(-1));
  document.getElementById("lb-next").addEventListener("click", () => step(1));
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLB(); });
  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLB();
    if (e.key === "ArrowLeft") step(1);   /* RTL: arrow-left = next */
    if (e.key === "ArrowRight") step(-1);
  });
})();
