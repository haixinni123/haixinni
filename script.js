/* ============================================================
   Phoebe & Vale Advisory — script.js
   Plain vanilla JS. No libraries, no jQuery.
   Sections:
     1. Navbar scroll shadow + mobile hamburger
     2. Smooth-scroll close-on-click
     3. IntersectionObserver scroll reveals
     4. Testimonial carousel
     5. Footer year
     6. Enquiry form validation + FormSubmit AJAX
   ============================================================ */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. NAVBAR — shadow on scroll + mobile hamburger toggle
     --------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const closeMenu = () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  // Close the mobile menu after a nav link is tapped (smooth scroll handled by CSS)
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close on Escape for accessibility
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("open")) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* ---------------------------------------------------------
     3. SCROLL REVEAL — IntersectionObserver fade/slide-in
     (smooth scrolling itself is handled in CSS)
     --------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    // No animation: just show everything
    revealEls.forEach((el) => el.classList.add("in-view"));
  } else {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target); // reveal once
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------
     4. TESTIMONIAL CAROUSEL
     --------------------------------------------------------- */
  const carousel = document.getElementById("carousel");
  if (carousel) {
    const track = document.getElementById("carouselTrack");
    const slides = Array.from(track.children);
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dotsWrap = document.getElementById("carouselDots");
    const AUTOPLAY_MS = 6000;

    let index = 0;
    let timer = null;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
      dot.addEventListener("click", () => {
        goTo(i);
        restart();
      });
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(" + -index * 100 + "%)";
      dots.forEach((d, di) =>
        d.setAttribute("aria-selected", String(di === index))
      );
    }

    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    function start() {
      if (prefersReduced) return; // respect reduced-motion: no autoplay
      stop();
      timer = window.setInterval(next, AUTOPLAY_MS);
    }
    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }
    const restart = () => {
      stop();
      start();
    };

    nextBtn.addEventListener("click", () => {
      next();
      restart();
    });
    prevBtn.addEventListener("click", () => {
      prev();
      restart();
    });

    // Pause on hover / focus within
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);

    // Keyboard arrows when carousel has focus
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        next();
        restart();
      } else if (e.key === "ArrowLeft") {
        prev();
        restart();
      }
    });

    goTo(0);
    start();
  }

  /* ---------------------------------------------------------
     5. FOOTER YEAR — auto-updating
     --------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------
     5b. SCROLL PROGRESS — gold hairline under the nav
     --------------------------------------------------------- */
  const progressEl = document.getElementById("scrollProgress");
  if (progressEl) {
    const updateProgress = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progressEl.style.width = pct + "%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------------------------------------------------------
     5c. ACTIVE NAV LINK — highlight the section in view
     --------------------------------------------------------- */
  const sectionLinks = Array.from(
    document.querySelectorAll('.nav-menu a[href^="#"]')
  );
  if (sectionLinks.length && "IntersectionObserver" in window) {
    const byId = new Map();
    sectionLinks.forEach((link) => {
      const id = link.getAttribute("href").slice(1);
      const section = document.getElementById(id);
      if (section) byId.set(section, link);
    });

    const navIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = byId.get(entry.target);
          if (!link) return;
          if (entry.isIntersecting) {
            sectionLinks.forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    byId.forEach((_link, section) => navIo.observe(section));
  }

  /* ---------------------------------------------------------
     5d. STAT COUNT-UP — animate hero figures into view once
     --------------------------------------------------------- */
  const counters = Array.from(document.querySelectorAll("[data-count-to]"));
  if (counters.length) {
    const runCount = (el) => {
      const target = parseFloat(el.getAttribute("data-count-to")) || 0;
      const prefix = el.getAttribute("data-count-prefix") || "";
      const suffix = el.getAttribute("data-count-suffix") || "";
      const final = prefix + target + suffix;

      if (prefersReduced) {
        el.textContent = final;
        return;
      }
      const duration = 1100;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        const val = Math.round(target * eased);
        el.textContent = prefix + val + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = final;
      };
      requestAnimationFrame(step);
    };

    if (prefersReduced || !("IntersectionObserver" in window)) {
      counters.forEach(runCount);
    } else {
      const countIo = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runCount(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((el) => countIo.observe(el));
    }
  }

  /* ---------------------------------------------------------
     6. ENQUIRY FORM — validation + FormSubmit AJAX
     --------------------------------------------------------- */

  // ===== REPLACE_WITH_YOUR_EMAIL =====
  // FormSubmit endpoint. Set this to your destination email address.
  // NOTE: FormSubmit requires a ONE-TIME activation: the first submission to a
  // new address triggers a confirmation email — click that link before the
  // form will deliver any messages.
  const FORMSUBMIT_EMAIL = "phoebe.hai@redbeaconam.com";
  const ENDPOINT = "https://formsubmit.co/ajax/" + FORMSUBMIT_EMAIL;

  const form = document.getElementById("enquiryForm");
  if (form) {
    const submitBtn = document.getElementById("submitBtn");
    const statusEl = document.getElementById("formStatus");
    const successPanel = document.getElementById("formSuccess");
    const honey = document.getElementById("_honey");

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Helper: set / clear an inline error on a field
    function setError(fieldId, message) {
      const input = document.getElementById(fieldId);
      const errEl = document.getElementById("err-" + fieldId);
      if (errEl) errEl.textContent = message || "";
      if (input) {
        input.classList.toggle("invalid", Boolean(message));
        input.setAttribute("aria-invalid", message ? "true" : "false");
      }
    }

    // Clear an error as the user corrects the field
    ["fullName", "email", "message"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", () => setError(id, ""));
    });

    function validate() {
      let firstInvalid = null;

      const name = form.elements["name"].value.trim();
      const email = form.elements["email"].value.trim();
      const message = form.elements["message"].value.trim();

      if (!name) {
        setError("fullName", "Please enter your full name.");
        firstInvalid = firstInvalid || "fullName";
      } else {
        setError("fullName", "");
      }

      if (!email) {
        setError("email", "Please enter your email address.");
        firstInvalid = firstInvalid || "email";
      } else if (!EMAIL_RE.test(email)) {
        setError("email", "Please enter a valid email address.");
        firstInvalid = firstInvalid || "email";
      } else {
        setError("email", "");
      }

      if (!message) {
        setError("message", "Please add a short message.");
        firstInvalid = firstInvalid || "message";
      } else {
        setError("message", "");
      }

      return firstInvalid;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      statusEl.textContent = "";
      statusEl.classList.remove("error");

      // Honeypot: if filled, silently pretend success (likely a bot)
      if (honey && honey.value.trim() !== "") {
        return;
      }

      const firstInvalid = validate();
      if (firstInvalid) {
        const el = document.getElementById(firstInvalid);
        if (el) el.focus();
        return;
      }

      // Build JSON payload incl. FormSubmit helper fields
      const payload = {
        name: form.elements["name"].value.trim(),
        email: form.elements["email"].value.trim(),
        phone: form.elements["phone"].value.trim(),
        interest: form.elements["interest"].value,
        message: form.elements["message"].value.trim(),
        _subject: "New enquiry from Phoebe & Vale website",
        _template: "table",
        _captcha: "false",
      };

      // Sending state
      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Request failed with status " + res.status);

        // FormSubmit returns { success: "true" | true, ... }.
        // Note: a needs-activation / rejected response still comes back as
        // HTTP 200 with success:"false", so we must check the body — not the
        // status — before declaring success.
        const data = await res.json().catch(() => ({}));
        const ok = data.success === true || data.success === "true";

        if (!ok) throw new Error(data.message || "Submission was not accepted.");

        // Success: hide form, show friendly message, reset state
        form.reset();
        form.hidden = true;
        successPanel.hidden = false;
        successPanel.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
      } catch (err) {
        // Error: inline message, re-enable button.
        // The one-time FormSubmit activation gets a tailored note so a real
        // visitor during that window isn't left confused.
        statusEl.textContent = /activation/i.test(err && err.message)
          ? "Almost there — this form needs a one-time activation. We've just emailed an activation link to the site owner; once it's clicked, your enquiry will come straight through. Please try again shortly."
          : "Sorry — something went wrong sending your enquiry. Please try again, or email us directly.";
        statusEl.classList.add("error");
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }
})();
