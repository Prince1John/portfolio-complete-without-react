/* ==========================================================================
   GALLERY.JS — device preview toggle, before/after slider, video modal
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Device preview toggle (desktop / tablet / mobile) ---------- */
  document.querySelectorAll("[data-device-toggle]").forEach((toggle) => {
    const targetId = toggle.getAttribute("data-device-toggle");
    const frame = document.getElementById(targetId);
    if (!frame) return;
    toggle.querySelectorAll("button[data-device]").forEach((btn) => {
      btn.addEventListener("click", () => {
        toggle.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        frame.setAttribute("data-device", btn.getAttribute("data-device"));
      });
    });
  });

  /* ---------- Before / After slider ---------- */
  document.querySelectorAll(".ba-slider").forEach((slider) => {
    const after = slider.querySelector(".ba-after");
    const handle = slider.querySelector(".ba-handle");
    if (!after || !handle) return;

    function setPosition(clientX) {
      const rect = slider.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.left = pct + "%";
    }

    let dragging = false;
    handle.addEventListener("pointerdown", (e) => { dragging = true; handle.setPointerCapture(e.pointerId); });
    window.addEventListener("pointermove", (e) => { if (dragging) setPosition(e.clientX); });
    window.addEventListener("pointerup", () => { dragging = false; });
    slider.addEventListener("click", (e) => setPosition(e.clientX));
  });

  /* ---------- Video modal (fullscreen player) ---------- */
  const modal = document.createElement("div");
  modal.className = "video-modal-overlay";
  modal.innerHTML = `
    <button class="video-modal-close" aria-label="Close video"><i class="fa-solid fa-xmark"></i></button>
    <div class="ratio ratio-16x9"><iframe id="video-modal-frame" src="" title="Video player" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>
  `;
  document.body.appendChild(modal);
  const modalFrame = modal.querySelector("#video-modal-frame");

  function openVideoModal(embedUrl) {
    modalFrame.src = embedUrl + (embedUrl.includes("?") ? "&" : "?") + "autoplay=1";
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeVideoModal() {
    modal.classList.remove("open");
    modalFrame.src = "";
    document.body.style.overflow = "";
  }
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest(".video-modal-close")) closeVideoModal();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeVideoModal(); });

  document.querySelectorAll("[data-video-embed]").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      openVideoModal(trigger.getAttribute("data-video-embed"));
    });
  });

  /* ---------- Hover preview: play muted preview on hover if data-hover-src set ---------- */
  document.querySelectorAll("[data-hover-preview]").forEach((card) => {
    const videoEl = card.querySelector("video");
    if (!videoEl) return;
    card.addEventListener("mouseenter", () => { videoEl.play().catch(() => {}); });
    card.addEventListener("mouseleave", () => { videoEl.pause(); videoEl.currentTime = 0; });
  });
});
