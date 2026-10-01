// --- Theme Toggle Logic ---
const themeToggleBtn = document.getElementById("themeToggleBtn");
const currentTheme = localStorage.getItem("portfolio_theme") || "light";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("portfolio_theme", theme);
  themeToggleBtn.textContent = theme === "dark" ? "☀️ Light" : "🌙 Dark";
}

applyTheme(currentTheme);

themeToggleBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

// --- Contact Form & LocalStorage Logic ---
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const timestamp = new Date().toLocaleString();

  const newEntry = { name, email, message, timestamp };

  // Fetch existing responses from localStorage or initialize empty array
  const responses = JSON.parse(localStorage.getItem("contact_responses")) || [];
  responses.push(newEntry);
  localStorage.setItem("contact_responses", JSON.stringify(responses));

  formStatus.textContent = "Thank you! Your message has been saved.";
  formStatus.className = "status-msg success";
  contactForm.reset();

  // If admin is currently logged in, refresh table immediately
  renderResponses();

  setTimeout(() => {
    formStatus.textContent = "";
  }, 4000);
});

// --- Admin Section Show/Hide & Authentication ---
const adminLoginForm = document.getElementById("adminLoginForm");
const adminLoginBox = document.getElementById("adminLoginBox");
const adminDashboard = document.getElementById("adminDashboard");
const loginError = document.getElementById("loginError");
const adminLogoutBtn = document.getElementById("adminLogoutBtn");
const responsesTableBody = document.getElementById("responsesTableBody");
const clearResponsesBtn = document.getElementById("clearResponsesBtn");

// Demo credentials
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

adminLoginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const usernameInput = document.getElementById("adminUsername").value.trim();
  const passwordInput = document.getElementById("adminPassword").value.trim();

  if (usernameInput === ADMIN_USER && passwordInput === ADMIN_PASS) {
    adminLoginBox.classList.add("hidden");
    adminDashboard.classList.remove("hidden");
    loginError.textContent = "";
    adminLoginForm.reset();
    renderResponses();
  } else {
    loginError.textContent = "Invalid username or password!";
  }
});

adminLogoutBtn.addEventListener("click", () => {
  adminDashboard.classList.add("hidden");
  adminLoginBox.classList.remove("hidden");
});

// Render responses in table
function renderResponses() {
  const responses = JSON.parse(localStorage.getItem("contact_responses")) || [];
  responsesTableBody.innerHTML = "";

  if (responses.length === 0) {
    responsesTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No responses submitted yet.</td></tr>`;
    return;
  }

  responses.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.timestamp}</td>
      <td>${escapeHTML(item.name)}</td>
      <td>${escapeHTML(item.email)}</td>
      <td>${escapeHTML(item.message)}</td>
    `;
    responsesTableBody.appendChild(row);
  });
}

// Clear all responses from localStorage
clearResponsesBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all stored responses?")) {
    localStorage.removeItem("contact_responses");
    renderResponses();
  }
});

// Basic sanitize helper to avoid XSS
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}