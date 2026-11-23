// ===== Fake data (replace with a real API later) =====
const products = [
  { id: 1, title: "غرفة نوم زان كلاسيك", category: "bedroom", icon: "🛏️", wood: "خشب زان", price: 28500 },
  { id: 2, title: "غرفة نوم مودرن", category: "bedroom", icon: "🛌", wood: "خشب موسكي", price: 21000 },
  { id: 3, title: "مطبخ خشب أرو", category: "kitchen", icon: "🍳", wood: "خشب أرو", price: 34000 },
  { id: 4, title: "مطبخ مودرن L", category: "kitchen", icon: "🍽️", wood: "خشب زان", price: 39500 },
  { id: 5, title: "باب خشب داخلي", category: "doors", icon: "🚪", wood: "خشب موسكي", price: 4200 },
  { id: 6, title: "باب شقة مصفح", category: "doors", icon: "🔒", wood: "خشب زان", price: 9800 },
];

const grid = document.getElementById("productGrid");
const filters = document.getElementById("filters");

// Format numbers in Arabic locale
const formatPrice = (n) => n.toLocaleString("ar-EG") + " ج.م";

function renderProducts(category = "all") {
  const list = category === "all" ? products : products.filter((p) => p.category === category);

  grid.innerHTML = list
    .map(
      (p) => `
      <article class="card product">
        <div class="product__img">${p.icon}</div>
        <div class="product__body">
          <h3>${p.title}</h3>
          <div class="product__meta">
            <span>${p.wood}</span>
            <span class="product__price">${formatPrice(p.price)}</span>
          </div>
        </div>
      </article>`
    )
    .join("");
}

filters.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter");
  if (!btn) return;
  filters.querySelectorAll(".filter").forEach((b) => b.classList.remove("is-active"));
  btn.classList.add("is-active");
  renderProducts(btn.dataset.filter);
});

// ===== Mobile menu =====
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") nav.classList.remove("is-open");
});

// ===== Animated counters =====
function animateCount(el) {
  const target = +el.dataset.count;
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      obs.unobserve(entry.target);
    }
  });
});
document.querySelectorAll("[data-count]").forEach((el) => observer.observe(el));

// ===== Form validation (demo only, nothing is sent) =====
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

function setError(name, msg) {
  form.querySelector(`[data-for="${name}"]`).textContent = msg;
  form.elements[name].classList.toggle("invalid", Boolean(msg));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.elements.name.value.trim();
  const phone = form.elements.phone.value.trim();
  let valid = true;

  setError("name", "");
  setError("phone", "");
  statusEl.textContent = "";

  if (name.length < 3) {
    setError("name", "من فضلك اكتب اسمك (3 حروف على الأقل)");
    valid = false;
  }
  // Egyptian mobile format: 01 + (0/1/2/5) + 8 digits
  if (!/^01[0125]\d{8}$/.test(phone)) {
    setError("phone", "اكتب رقم موبايل مصري صحيح");
    valid = false;
  }
  if (!valid) return;

  statusEl.textContent = "تم استلام طلبك (تجريبي) وهنتواصل معاك قريب ✅";
  form.reset();
});

// ===== Back-to-top button =====
const toTop = document.getElementById("toTop");
window.addEventListener("scroll", () => {
  toTop.classList.toggle("is-visible", window.scrollY > 500);
});
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ===== Init =====
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
