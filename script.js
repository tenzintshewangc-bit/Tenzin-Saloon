/* ===== Belle Rose Salon — interactions ===== */

// --- Mobile menu -----------------------------------------------------------
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");

burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    burger.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

// --- Sticky navbar + back-to-top ------------------------------------------
const nav = document.getElementById("nav");
const toTop = document.getElementById("toTop");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
  toTop.classList.toggle("show", window.scrollY > 500);
});

// --- Scroll reveal ---------------------------------------------------------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 0.1}s`;
  revealObserver.observe(el);
});

// --- Animated stat counters -----------------------------------------------
const animateCount = (el) => {
  const target = Number(el.dataset.count);
  const duration = 1600;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(target * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString() + "+";
  };

  requestAnimationFrame(tick);
};

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

// --- Booking form ----------------------------------------------------------
const form = document.getElementById("bookingForm");
const formMsg = document.getElementById("formMsg");
const dateInput = document.getElementById("date");

// No bookings in the past.
dateInput.min = new Date().toISOString().split("T")[0];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const fields = ["name", "phone", "service", "date"].map((id) =>
    document.getElementById(id)
  );

  let valid = true;
  fields.forEach((field) => {
    const empty = !field.value.trim();
    field.classList.toggle("invalid", empty);
    if (empty) valid = false;
  });

  if (!valid) {
    formMsg.textContent = "Please fill in all the required fields.";
    formMsg.className = "form-msg error";
    return;
  }

  const name = document.getElementById("name").value.trim();
  const service = document.getElementById("service").value;

  formMsg.textContent = `Thank you, ${name}! Your ${service} appointment request is in — we'll call to confirm shortly.`;
  formMsg.className = "form-msg ok";
  form.reset();
});

// Clear the error styling as soon as the user starts typing.
form.querySelectorAll("input, select").forEach((field) => {
  field.addEventListener("input", () => field.classList.remove("invalid"));
});
