
// ==========================================
// SMART PHC - PATIENT DASHBOARD
// ==========================================

// ==========================================
// 1. GET LOGGED-IN PATIENT INFORMATION
// ==========================================

function getSavedUser() {
    try {
        return JSON.parse(localStorage.getItem("smartPHCUser")) || {};
    } catch (error) {
        return {};
    }
}

let savedUser = getSavedUser();

const patientID = String(
    savedUser.patientID || savedUser.patientId || ""
).trim();

const patientName = savedUser.fullName || savedUser.name || "Patient";


// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

function getStoredRecords(key) {
    try {
        const records = JSON.parse(localStorage.getItem(key));
        return Array.isArray(records) ? records : [];
    } catch (error) {
        return [];
    }
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function displayValue(value) {
    if (value === null || value === undefined || value === "") {
        return "Not available";
    }

    return escapeHTML(value);
}

function formatDate(value) {
    if (!value) return "Not available";

    const date = String(value).includes("T")
        ? new Date(value)
        : new Date(value + "T00:00:00");

    if (isNaN(date.getTime())) {
        return escapeHTML(value);
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


// Get only records belonging to logged-in patient
function getPatientRecords(storageKey) {
    if (!patientID) {
        return [];
    }

    return getStoredRecords(storageKey).filter(record =>
        String(record.patientID || "").trim() === patientID
    );
}


// Get the most recently updated health record
function getLatestHealthRecord() {
    const records = getPatientRecords("smartPHCHealthRecords");

    if (records.length === 0) {
        return {};
    }

    return [...records].sort((a, b) => {
        const dateA = new Date(
            a.updatedAt || a.visitDate || 0
        ).getTime() || 0;

        const dateB = new Date(
            b.updatedAt || b.visitDate || 0
        ).getTime() || 0;

        return dateB - dateA;
    })[0];
}


// ==========================================
// 3. DISPLAY PATIENT PROFILE INFORMATION
// ==========================================

function displayPatientProfile() {
    const latestRecord = getLatestHealthRecord();

    const fields = {
        patientName: patientName,
        profileName: patientName,
        profilePatientId: patientID || "Not assigned",
        profileEmail: savedUser.email || "Not available",
        profilePhone: savedUser.phone || "Not available",
        profileAge: latestRecord.age || savedUser.age || "Not provided",

        // Gender comes from staff health record first
        profileGender: latestRecord.gender ||
            savedUser.gender || "Not provided",

        profileBloodGroup: latestRecord.bloodGroup ||
            savedUser.bloodGroup || "Not provided",

        profileAddress: savedUser.address || "Not provided"
    };

    Object.entries(fields).forEach(([id, value]) => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    });
}

displayPatientProfile();


// ==========================================
// 4. LOGOUT
// ==========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("smartPHCUser");
        window.location.href = "role-selection.html";
    });
}


// ==========================================
// 5. SIDEBAR NAVIGATION
// ==========================================

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
    link.addEventListener("click", function () {
        navLinks.forEach(nav => nav.classList.remove("active"));
        this.classList.add("active");
    });
});


// ==========================================
// 6. MOBILE SIDEBAR
// ==========================================

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


// ==========================================
// 7. HEALTH RECORDS POPUP
// ==========================================

const recordModal = document.getElementById("recordModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

function createRecordCard(title, fields) {

    let html = `
        <div class="patient-record-details">
            <h3>${escapeHTML(title)}</h3>
    `;

    fields.forEach(([label, value]) => {
        html += `
            <p>
                <strong>${escapeHTML(label)}:</strong>
                ${displayValue(value)}
            </p>
        `;
    });

    html += `</div>`;

    return html;
}


// ==========================================
// 8. PATIENT INFORMATION
// ==========================================

function showPatientInformation() {

    const latestRecord = getLatestHealthRecord();

    return createRecordCard("My Personal Information", [

        ["Patient Name", patientName],

        ["Patient ID", patientID || "Not assigned"],

        ["Email", savedUser.email],

        ["Phone Number", savedUser.phone],

        ["Age", latestRecord.age || savedUser.age],

        // Fetch gender from staff health record first
        ["Gender", latestRecord.gender || savedUser.gender],

        ["Blood Group", latestRecord.bloodGroup || savedUser.bloodGroup],

        ["Address", savedUser.address],

        ["Medical History", latestRecord.medicalHistory],

        ["Allergies", latestRecord.allergies]

    ]);
}


// ==========================================
// 9. CONSULTATION / HEALTH RECORDS
// ==========================================

function showConsultationHistory() {

    const records = getPatientRecords("smartPHCHealthRecords");

    if (!patientID) {
        return "<p>Patient ID is not available. Please log in again.</p>";
    }

    if (records.length === 0) {
        return `
            <p>No consultation records available yet.</p>
            <p>Your health records will appear here after the PHC staff updates them.</p>
        `;
    }

    return records.map(record => {

        return createRecordCard("Health Record", [

            ["Record ID", record.recordID],
            ["Patient Name", record.patientName],
            ["Patient ID", record.patientID],
            ["Age", record.age],
            ["Gender", record.gender],
            ["Blood Group", record.bloodGroup],
            ["Visit Date", formatDate(record.visitDate)],
            ["Medical History", record.medicalHistory],
            ["Allergies", record.allergies],
            ["Diagnosis", record.diagnosis],
            ["Treatment Details", record.treatmentDetails],
            ["Doctor Name", record.doctorName],
            ["Remarks", record.remarks]

        ]);

    }).join("");
}


// ==========================================
// 10. PRESCRIPTION RECORDS
// ==========================================

function showPrescriptions() {

    const records = getPatientRecords("smartPHCPrescriptions");

    if (!patientID) {
        return "<p>Patient ID is not available. Please log in again.</p>";
    }

    if (records.length === 0) {
        return `
            <p>No prescriptions available yet.</p>
            <p>Your doctor's prescriptions will appear here after the staff records them.</p>
        `;
    }

    return records.map(record => {

        return createRecordCard("Prescription", [

            ["Prescription ID", record.prescriptionID],
            ["Patient Name", record.patientName],
            ["Patient ID", record.patientID],
            ["Doctor Name", record.doctorName],
            ["Medicine Name", record.medicineName],
            ["Dosage", record.dosage],
            ["Frequency", record.frequency],
            ["Duration", record.duration],
            ["Instructions", record.instructions],
            ["Prescription Date", formatDate(record.prescriptionDate)],
            ["Authorization Status", record.authorizationStatus]

        ]);

    }).join("");
}


// ==========================================
// 11. VACCINATION RECORDS
// ==========================================

function showVaccinationHistory() {

    const records = getPatientRecords("smartPHCVaccinationRecords");

    if (!patientID) {
        return "<p>Patient ID is not available. Please log in again.</p>";
    }

    if (records.length === 0) {
        return `
            <p>No vaccination records available yet.</p>
            <p>Your vaccination history will appear here after the PHC staff updates them.</p>
        `;
    }

    return records.map(record => {

        return createRecordCard("Vaccination Record", [

            ["Vaccination ID", record.vaccinationID],
            ["Patient Name", record.patientName],
            ["Patient ID", record.patientID],
            ["Vaccine Name", record.vaccineName],
            ["Dose Number", record.doseNumber],
            ["Vaccination Date", formatDate(record.vaccinationDate)],
            ["Next Vaccination Date", formatDate(record.nextVaccinationDate)],
            ["Vaccination Status", record.vaccinationStatus],
            ["Administered By", record.administeredBy],
            ["Remarks", record.remarks]

        ]);

    }).join("");
}


// ==========================================
// 12. CONNECT VIEW DETAILS BUTTONS
// ==========================================

if (recordModal && modalTitle && modalBody && closeModal) {

    document.querySelectorAll(".record-card button").forEach(button => {

        button.addEventListener("click", function () {

            const heading = this.parentElement.querySelector("h3");

            if (!heading) return;

            const title = heading.textContent.trim();

            modalTitle.textContent = title;

            if (title === "Patient Information") {

                modalBody.innerHTML = showPatientInformation();

            } else if (title === "Consultation History") {

                modalBody.innerHTML = showConsultationHistory();

            } else if (title === "Prescriptions") {

                modalBody.innerHTML = showPrescriptions();

            } else if (title === "Vaccination History") {

                modalBody.innerHTML = showVaccinationHistory();

            } else {

                modalBody.innerHTML = "<p>No details available.</p>";

            }

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


// ==========================================
// 13. EDIT PROFILE POPUP
// ==========================================

const editProfileBtn = document.getElementById("editProfileBtn");
const editProfileModal = document.getElementById("editProfileModal");
const closeEditModal = document.getElementById("closeEditModal");
const editProfileForm = document.getElementById("editProfileForm");

if (editProfileBtn && editProfileModal && editProfileForm) {

    editProfileBtn.addEventListener("click", function () {

        const user = getSavedUser();

        document.getElementById("editPhone").value = user.phone || "";
        document.getElementById("editAge").value = user.age || "";
        document.getElementById("editGender").value = user.gender || "";
        document.getElementById("editBloodGroup").value = user.bloodGroup || "";
        document.getElementById("editAddress").value = user.address || "";

        editProfileModal.classList.add("active");
    });


    if (closeEditModal) {

        closeEditModal.addEventListener("click", function () {
            editProfileModal.classList.remove("active");
        });

    }


    editProfileForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const user = getSavedUser();

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

        savedUser = user;

        displayPatientProfile();

        editProfileModal.classList.remove("active");

        const successModal = document.getElementById("successModal");

        if (successModal) {
            successModal.classList.add("active");
        }

    });
}


// ==========================================
// 14. PROFILE SUCCESS POPUP
// ==========================================

const successModal = document.getElementById("successModal");
const successOkBtn = document.getElementById("successOkBtn");

if (successOkBtn && successModal) {

    successOkBtn.addEventListener("click", function () {
        successModal.classList.remove("active");
    });

}
