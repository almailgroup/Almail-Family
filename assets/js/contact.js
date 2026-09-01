/* =============================================================================
   contact.js — contact form validation and submission
   =============================================================================

   >>> CONNECTING THE FORM <<<
   The form works out of the box with no backend: it opens the visitor's mail
   client with everything pre-filled. To collect submissions instead, paste a
   form endpoint below (Formspree, Basin, Netlify Forms, your own handler —
   anything that accepts a JSON POST) and the form will submit over fetch().

     var ENDPOINT = "https://formspree.io/f/xxxxxxxx";
   ========================================================================== */

(function () {
  "use strict";

  var ENDPOINT = "";                            // ← paste your form endpoint here
  var FALLBACK_EMAIL = "family@almail.example"; // ← used when ENDPOINT is empty

  /* Validation rules, one per field name. Return an error string or "". */
  var t = ALMAIL.i18n.t;

  var RULES = {
    name: function (v) {
      return v.trim().length >= 2 ? "" : t("contact.errName", "Please enter your name.");
    },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
        ? "" : t("contact.errEmail", "Please enter a valid email address.");
    },
    subject: function (v) {
      return v.trim() ? "" : t("contact.errSubject", "Please choose a subject.");
    },
    message: function (v) {
      return v.trim().length >= 20
        ? "" : t("contact.errMessage", "Please write at least 20 characters.");
    },
  };

  function setError(field, message) {
    var wrap = field.closest("[data-field]");
    var errorEl = wrap && wrap.querySelector(".field-error");
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.toggle("is-visible", Boolean(message));
    }
    return !message;
  }

  function validate(form, only) {
    var valid = true;
    Object.keys(RULES).forEach(function (name) {
      if (only && only !== name) return;
      var field = form.elements[name];
      if (!field) return;
      if (!setError(field, RULES[name](field.value))) valid = false;
    });
    return valid;
  }

  function init() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var status = document.getElementById("form-status");
    var submit = form.querySelector('[type="submit"]');

    function say(message, tone) {
      if (!status) return;
      status.textContent = message;
      status.hidden = !message;
      status.className = "mt-6 border px-4 py-3 text-[15px] " +
        (tone === "error" ? "border-line-2 text-ink-2" : "border-ink text-ink");
    }

    /* Validate a field once it has been touched, then live as it is corrected. */
    Object.keys(RULES).forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;
      field.addEventListener("blur", function () { validate(form, name); });
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") validate(form, name);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      say("");

      // Honeypot: a real person never fills this hidden field.
      if (form.elements.company && form.elements.company.value) return;

      if (!validate(form)) {
        say(t("contact.errSummary", "Please check the highlighted fields and try again."), "error");
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      var data = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        subject: form.elements.subject.value,
        message: form.elements.message.value.trim(),
      };

      /* No endpoint configured → hand off to the visitor's mail client. */
      if (!ENDPOINT) {
        var body =
          data.message + "\n\n—\n" + data.name + "\n" + data.email;
        window.location.href =
          "mailto:" + FALLBACK_EMAIL +
          "?subject=" + encodeURIComponent("[" + data.subject + "] " + data.name) +
          "&body=" + encodeURIComponent(body);
        say(t("contact.mailto", "Opening your email app with the message ready to send."));
        return;
      }

      submit.disabled = true;
      var original = submit.textContent;
      submit.textContent = t("contact.sending", "Sending…");

      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed: " + res.status);
          form.reset();
          say(t("contact.sent", "Thank you — your message has been sent. We'll be in touch shortly."));
        })
        .catch(function () {
          say(t("contact.failed",
            "Something went wrong sending your message. Please email us directly at {email}.",
            { email: FALLBACK_EMAIL }), "error");
        })
        .finally(function () {
          submit.disabled = false;
          submit.textContent = original;
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
