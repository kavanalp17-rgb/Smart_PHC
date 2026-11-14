
// Get saved patient information
const savedUser = JSON.parse(
    localStorage.getItem("smartPHCUser")
);

// Display patient information
if (savedUser) {
    document.getElementById("patientName").textContent =
        savedUser.fullName || "Patient";

    document.getElementById("profileName").textContent =
        savedUser.fullName || "Patient";

    document.getElementById("profileEmail").textContent =
        savedUser.email || "Not available";

    document.getElementById("profilePhone").textContent =
        savedUser.phone || "Not available";

    // Display additional profile details
    document.getElementById("profileAge").textContent =
        savedUser.age || "Not provided";

    document.getElementById("profileGender").textContent =
        savedUser.gender || "Not provided";

    document.getElementById("profileBloodGroup").textContent =
        savedUser.bloodGroup || "Not provided";

    document.getElementById("profileAddress").textContent =
        savedUser.address || "Not provided";
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("smartPHCUser");
        window.location.href = "role-selection.html";
    });
}

// Sidebar navigation
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
    link.addEventListener("click", function () {
        navLinks.forEach(nav => nav.classList.remove("active"));
        this.classList.add("active");
    });
});

// Mobile Sidebar Toggle
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

if (menuToggle && sidebar && sidebarOverlay) {
    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("active");
        sidebarOverlay.classList.toggle("active");
    });

    sidebarOverlay.addEventListener("click", function () {
        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");
    });

    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            sidebar.classList.remove("active");
            sidebarOverlay.classList.remove("active");
        });
    });
}

// Health Records Popup
const recordModal = document.getElementById("recordModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

const recordDetails = {
    "Patient Information": `
        <p><strong>Name:</strong> ${savedUser?.fullName || "Patient"}</p>
        <p><strong>Email:</strong> ${savedUser?.email || "Not available"}</p>
        <p><strong>Phone:</strong> ${savedUser?.phone || "Not available"}</p>
        <p><strong>Patient ID:</strong> Not assigned yet</p>
    `,

    "Consultation History": `
        <p>No previous consultations available.</p>
        <p>Consultation records will appear here after your doctor updates them.</p>
    `,

    "Prescriptions": `
        <p>No prescriptions available.</p>
        <p>Your doctor's prescriptions will appear here.</p>
    `,

    "Vaccination History": `
        <p>No vaccination records available.</p>
        <p>Your vaccination history will appear here.</p>
    `
};

if (recordModal && modalTitle && modalBody && closeModal) {
    document.querySelectorAll(".record-card button").forEach(button => {
        button.addEventListener("click", function () {
            const title = this.parentElement.querySelector("h3").textContent;

            modalTitle.textContent = title;
            modalBody.innerHTML =
                recordDetails[title] || "<p>No details available.</p>";

            recordModal.classList.add("active");
        });
    });

    closeModal.addEventListener("click", function () {
        recordModal.classList.remove("active");
    });

    recordModal.addEventListener("click", function (event) {
        if (event.target === recordModal) {
            recordModal.classList.remove("active");
        }
    });
}

// Edit Profile Popup
const editProfileBtn = document.getElementById("editProfileBtn");
const editProfileModal = document.getElementById("editProfileModal");
const closeEditModal = document.getElementById("closeEditModal");
const editProfileForm = document.getElementById("editProfileForm");

// Open popup and load saved details
if (editProfileBtn && editProfileModal && editProfileForm) {
    editProfileBtn.addEventListener("click", function () {
        const user = JSON.parse(
            localStorage.getItem("smartPHCUser")
        ) || {};

        document.getElementById("editPhone").value = user.phone || "";
        document.getElementById("editAge").value = user.age || "";
        document.getElementById("editGender").value = user.gender || "";
        document.getElementById("editBloodGroup").value = user.bloodGroup || "";
        document.getElementById("editAddress").value = user.address || "";

        editProfileModal.classList.add("active");
    });

    // Close popup
    if (closeEditModal) {
        closeEditModal.addEventListener("click", function () {
            editProfileModal.classList.remove("active");
        });
    }

    // Save profile details
    editProfileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const user = JSON.parse(
            localStorage.getItem("smartPHCUser")
        ) || {};

        const phone = document.getElementById("editPhone").value.trim();
        const age = document.getElementById("editAge").value;
        
        if (!/^\d{10}$/.test(phone)) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        if (age && (Number(age) < 1 || Number(age) > 120)) {
            alert("Please enter a valid age.");
            return;
        }

        user.phone = phone;
        user.age = age;
        user.gender = document.getElementById("editGender").value;
        user.bloodGroup = document.getElementById("editBloodGroup").value;
        user.address = document.getElementById("editAddress").value.trim();

        localStorage.setItem("smartPHCUser", JSON.stringify(user));

        // Update profile display
        document.getElementById("profilePhone").textContent =
            user.phone;

        document.getElementById("profileAge").textContent =
            user.age || "Not provided";

        document.getElementById("profileGender").textContent =
            user.gender || "Not provided";

        document.getElementById("profileBloodGroup").textContent =
            user.bloodGroup || "Not provided";

        document.getElementById("profileAddress").textContent =
            user.address || "Not provided";

        editProfileModal.classList.remove("active");

document.getElementById("successModal").classList.add("active");    });
}
// Success Popup Close
const successModal = document.getElementById("successModal");
const successOkBtn = document.getElementById("successOkBtn");

successOkBtn.addEventListener("click", function () {
    successModal.classList.remove("active");
});
