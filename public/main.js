// NAV scroll effect
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
});

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open");
    // Lock body scroll (position:fixed required for iOS Safari)
    document.body.style.overflow = isOpen ? "hidden" : "";
    document.body.style.position = isOpen ? "fixed" : "";
    document.body.style.width = isOpen ? "100%" : "";
  });
  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      if (window.innerWidth <= 900 && a.parentElement.classList.contains("has-dropdown")) return;
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    });
  });

  // Mobile dropdown tap-toggle
  document.querySelectorAll(".has-dropdown").forEach((item) => {
    item.querySelector(":scope > a").addEventListener("click", (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        item.classList.toggle("open");
      }
    });
  });
}

// Intersection Observer – fade-up animations
const fadeEls = document.querySelectorAll(".fade-up");
if (fadeEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  fadeEls.forEach((el) => io.observe(el));
}

// Contact form
async function handleSubmit(e) {
  e.preventDefault();
  const note = document.getElementById("formNote");
  const btn = e.target.querySelector("button[type=submit]");
  const lang = getLang();

  btn.disabled = true;
  btn.textContent = translations[lang]["form.sending"];
  note.textContent = "";

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(e.target))),
    });
    const data = await res.json();
    if (data.success) {
      btn.textContent = translations[lang]["form.sent"];
      note.style.color = "";
      note.textContent = translations[lang]["form.success"];
      e.target.reset();
    } else {
      throw new Error(data.message);
    }
  } catch {
    btn.disabled = false;
    btn.textContent = translations[lang]["form.send"] || "Send Message";
    note.style.color = "#b03a2e";
    note.textContent =
      translations[lang]["form.error"] || "Something went wrong. Please try again.";
  }
}

// ===== i18n =====
const LANG_KEY = "enso-lang";

function getLang() {
  return localStorage.getItem(LANG_KEY) || "el";
}

function applyLang(lang) {
  document.documentElement.lang = lang === "el" ? "el" : "en";
  const t = translations[lang];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const val = t[el.dataset.i18n];
    if (val !== undefined) el.textContent = val;
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const val = t[el.dataset.i18nHtml];
    if (val !== undefined) el.innerHTML = val;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const val = t[el.dataset.i18nPlaceholder];
    if (val !== undefined) el.placeholder = val;
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang;
    localStorage.setItem(LANG_KEY, lang);
    applyLang(lang);
  });
});

applyLang(getLang());
