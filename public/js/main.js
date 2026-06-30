// ===============================
// Navigation + Page Switching
// ===============================
const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll("[data-target]");
const mobileMenu = document.getElementById("mobile-menu");
const hamburger = document.querySelector(".hamburger");

function openPage(id) {
  pages.forEach(page => {
    page.classList.toggle("active", page.id === id);
  });

  document
    .querySelectorAll(".nav-link, .mob-link")
    .forEach(link => {
      link.classList.toggle(
        "active",
        link.dataset.target === id
      );
    });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  mobileMenu?.classList.remove("open");
}

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    openPage(link.dataset.target);
  });
});

// ===============================
// Mobile Menu
// ===============================
if (hamburger) {
  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");

    const expanded =
      hamburger.getAttribute("aria-expanded") === "true";

    hamburger.setAttribute(
      "aria-expanded",
      !expanded
    );
  });
}

// ===============================
// Hero Buttons
// ===============================
document.querySelectorAll(".btn[data-target]")
.forEach(btn => {
  btn.addEventListener("click", () => {
    openPage(btn.dataset.target);
  });
});

// ===============================
// Contact Form
// ===============================
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

if (form) {
  form.addEventListener("submit", async e => {
    e.preventDefault();

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim()
    };

    status.textContent = "Sending...";
    status.className = "form-status";

    try {
      const response = await fetch(
        "/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify(data)
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
          "Message failed."
        );
      }

      status.textContent =
        "Message sent successfully ✓";

      status.classList.add(
        "success"
      );

      form.reset();

    } catch (err) {
      status.textContent =
        err.message ||
        "Something went wrong.";

      status.classList.add(
        "error"
      );
    }
  });
}

// ===============================
// Load Profile
// ===============================
async function loadProfile() {
  try {
    const res =
      await fetch("/api/profile");

    const data =
      await res.json();

    console.log(
      "Profile Loaded:",
      data
    );

  } catch (err) {
    console.log(
      "Profile unavailable"
    );
  }
}

loadProfile();

// Default page
openPage("home");
