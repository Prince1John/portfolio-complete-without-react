/* ==========================================================================
   FORM.JS — Formspree contact form
   Handles client-side validation, async submit, and status messaging.
   Replace FORM_ENDPOINT below with your real Formspree endpoint.
   ========================================================================== */
(function () {
  const FORM_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const statusBox = document.getElementById("form-status");
    const submitBtn = form.querySelector("[type=submit]");

    function showError(field, message) {
      const errEl = form.querySelector(`[data-error-for="${field}"]`);
      if (errEl) {
        errEl.textContent = message;
        errEl.classList.add("show");
      }
    }
    function clearErrors() {
      form.querySelectorAll(".field-error").forEach((el) => {
        el.textContent = "";
        el.classList.remove("show");
      });
    }

    function validate(data) {
      let valid = true;
      if (!data.name || data.name.trim().length < 2) {
        showError("name", "Please enter your full name.");
        valid = false;
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.email || !emailPattern.test(data.email)) {
        showError("email", "Please enter a valid email address.");
        valid = false;
      }
      if (!data.subject || data.subject.trim().length < 2) {
        showError("subject", "Please add a short subject.");
        valid = false;
      }
      if (!data.message || data.message.trim().length < 10) {
        showError("message", "Message should be at least 10 characters.");
        valid = false;
      }
      // Honeypot anti-spam field must stay empty
      if (data._gotcha) {
        valid = false;
      }
      return valid;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearErrors();
      statusBox.className = "form-status";
      statusBox.textContent = "";

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      if (!validate(data)) return;

      submitBtn.disabled = true;
      const originalLabel = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending…';

      try {
        const response = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        });

        if (response.ok) {
          statusBox.textContent = "Thanks — your message is on its way. I'll reply within 24 hours.";
          statusBox.className = "form-status success";
          form.reset();
        } else {
          const result = await response.json().catch(() => null);
          const msg = result?.errors?.map((er) => er.message).join(", ")
            || "Something went wrong sending your message. Please try again or email directly.";
          statusBox.textContent = msg;
          statusBox.className = "form-status error";
        }
      } catch (err) {
        statusBox.textContent = "Network error — please check your connection and try again.";
        statusBox.className = "form-status error";
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
      }
    });
  });
})();
