// =========================
// MOBILE SIDEBAR
// =========================

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

menuToggle.addEventListener("click", function () {
    sidebar.classList.toggle("active");
    sidebarOverlay.classList.toggle("active");
});

sidebarOverlay.addEventListener("click", function () {
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
});


// =========================
// SIDEBAR NAVIGATION
// =========================

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {

    link.addEventListener("click", function () {

        // Only update active state for dashboard navigation
        if (this.getAttribute("href") === "#dashboard") {

            navLinks.forEach(nav => {
                nav.classList.remove("active");
            });

            this.classList.add("active");
        }

        // Close mobile sidebar
        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");

    });

});


// =========================
// CURRENT DATE
// =========================

const dateElement = document.getElementById("currentDate");

const today = new Date();

dateElement.textContent = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});