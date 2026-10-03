/* ==========================================================================
   ANIMATIONS.JS — scroll reveals, typewriter roles, hero circuit background
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach((el, i) => {
      el.style.setProperty("--stagger", i % 6);
      revealObserver.observe(el);
    });
  }

  /* ---------- Typewriter for hero role line ---------- */
  const typeEl = document.getElementById("typed-roles");
  if (typeEl) {
    const roles = JSON.parse(typeEl.getAttribute("data-roles") || "[]");
    let roleIndex = 0, charIndex = 0, deleting = false;

    function typeTick() {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        typeEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeTick, 1400);
          return;
        }
      } else {
        charIndex--;
        typeEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(typeTick, deleting ? 35 : 65);
    }
    if (roles.length) typeTick();
  }

  /* ---------- Hero circuit / dot-grid canvas background ---------- */
  const canvas = document.getElementById("hero-canvas");
  if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ctx = canvas.getContext("2d");
    let w, h, points = [];
    const SPACING = 46;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      points = [];
      for (let x = 0; x < w + SPACING; x += SPACING) {
        for (let y = 0; y < h + SPACING; y += SPACING) {
          points.push({ x, y, baseX: x, baseY: y, phase: Math.random() * Math.PI * 2 });
        }
      }
    }

    let t = 0;
    function draw() {
      t += 0.006;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(18,224,196,0.35)";
      points.forEach((p) => {
        const dy = Math.sin(t + p.phase) * 4;
        ctx.beginPath();
        ctx.arc(p.baseX, p.baseY + dy, 1.4, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();
  }
});
