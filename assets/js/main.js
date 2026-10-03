/* ==========================================================================
   MAIN.JS — global site behavior
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById("loading-screen");
  if (loader) {
    window.addEventListener("load", () => {
      setTimeout(() => loader.classList.add("hidden"), 350);
    });
    // Safety net in case 'load' already fired
    setTimeout(() => loader.classList.add("hidden"), 2500);
  }

  /* ---------- Sticky navbar: shrink + hide on scroll down ---------- */
  const header = document.querySelector(".site-header");
  const progressBar = document.getElementById("scroll-progress");
  let lastScrollY = window.scrollY;

  function onScroll() {
    const y = window.scrollY;

    if (header) {
      header.classList.toggle("scrolled", y > 12);
      if (y > lastScrollY && y > 160) {
        header.classList.add("nav-hidden");
      } else {
        header.classList.remove("nav-hidden");
      }
    }
    lastScrollY = y;

    // Scroll progress bar
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
      progressBar.style.width = pct + "%";
    }

    // Back to top visibility
    const backToTop = document.getElementById("back-to-top");
    if (backToTop) backToTop.classList.toggle("show", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Active nav link highlighting ---------- */
  const currentPage = (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav-link-custom").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-counter]");
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-counter"), 10) || 0;
        const duration = 1400;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toString();
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target.toString();
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: 0.4 });

    counters.forEach((c) => counterObserver.observe(c));
  }

  /* ---------- Skill bar fill on scroll ---------- */
  const skillFills = document.querySelectorAll(".skill-fill");
  if (skillFills.length) {
    const skillObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.width = el.getAttribute("data-fill") || "0%";
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    skillFills.forEach((el) => skillObserver.observe(el));
  }

  /* ---------- Cookie notice ---------- */
  const cookieBanner = document.getElementById("cookie-banner");
  if (cookieBanner) {
    const KEY = "jo-cookie-consent";
    if (!localStorage.getItem(KEY)) {
      setTimeout(() => cookieBanner.classList.add("show"), 900);
    }
    document.getElementById("cookie-accept")?.addEventListener("click", () => {
      localStorage.setItem(KEY, "accepted");
      cookieBanner.classList.remove("show");
    });
    document.getElementById("cookie-decline")?.addEventListener("click", () => {
      localStorage.setItem(KEY, "declined");
      cookieBanner.classList.remove("show");
    });
  }

  /* ---------- Lazy loading images (native fallback shimmer removal) ---------- */
  document.querySelectorAll("img.lazy").forEach((img) => {
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", () => img.classList.add("loaded"));
    }
  });

  /* ---------- Print CV button ---------- */
  document.querySelectorAll("[data-print-cv]").forEach((btn) => {
    btn.addEventListener("click", () => window.print());
  });
});
