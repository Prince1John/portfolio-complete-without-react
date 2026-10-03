/* ==========================================================================
   PORTFOLIO.JS — category filter + search for portfolio grids
   Works on any grid where items are wrapped in [data-portfolio-item]
   with a data-category attribute, inside a container with [data-portfolio-grid].
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const grids = document.querySelectorAll("[data-portfolio-grid]");

  grids.forEach((grid) => {
    const scope = grid.closest("[data-portfolio-scope]") || document;
    const filterButtons = scope.querySelectorAll("[data-filter]");
    const searchInput = scope.querySelector("[data-portfolio-search]");
    const items = grid.querySelectorAll("[data-portfolio-item]");
    const emptyState = scope.querySelector("[data-portfolio-empty]");

    let activeFilter = "all";
    let searchTerm = "";

    function applyFilters() {
      let visibleCount = 0;
      items.forEach((item) => {
        const category = item.getAttribute("data-category") || "";
        const title = (item.getAttribute("data-title") || "").toLowerCase();
        const matchesFilter = activeFilter === "all" || category === activeFilter;
        const matchesSearch = !searchTerm || title.includes(searchTerm);
        const show = matchesFilter && matchesSearch;
        item.style.display = show ? "" : "none";
        if (show) visibleCount++;
      });
      if (emptyState) emptyState.style.display = visibleCount === 0 ? "block" : "none";
    }

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.getAttribute("data-filter");
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        searchTerm = searchInput.value.trim().toLowerCase();
        applyFilters();
      });
    }
  });

  /* ---------- Simple lightbox for images with [data-lightbox] ---------- */
  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = '<button class="lightbox-close" aria-label="Close preview"><i class="fa-solid fa-xmark"></i></button><img src="" alt="">';
  document.body.appendChild(overlay);
  const overlayImg = overlay.querySelector("img");

  document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
    trigger.style.cursor = "zoom-in";
    trigger.addEventListener("click", () => {
      const src = trigger.getAttribute("data-lightbox") || trigger.getAttribute("src");
      overlayImg.src = src;
      overlayImg.alt = trigger.getAttribute("alt") || "";
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.closest(".lightbox-close")) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
});
