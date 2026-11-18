
/* ==============================================
   SMART PHC - DOCTOR DASHBOARD
============================================== */

// 1. STORAGE KEYS
const DOCTOR_STORAGE_KEY = "smartPHCDoctors";
const LOGGED_DOCTOR_KEY = "smartPHCLoggedInDoctor";

const PATIENT_STORAGE_KEY = "smartPHCPatients";
const HEALTH_STORAGE_KEY = "smartPHCHealthRecords";
const PRESCRIPTION_STORAGE_KEY = "smartPHCPrescriptions";
const VACCINATION_STORAGE_KEY = "smartPHCVaccinationRecords";


// 2. GET HTML ELEMENTS
const doctorNameElement = document.getElementById("doctorName");
const welcomeDoctorName = document.getElementById("welcomeDoctorName");

const totalPatientsElement = document.getElementById("totalPatients");
const doctorAvailabilityElement = document.getElementById("doctorAvailability");
const availabilityText = document.getElementById("availabilityText");

const patientSearch = document.getElementById("patientSearch");
const patientTableBody = document.getElementById("patientTableBody");

const patientDetails = document.getElementById("patientDetails");
const patientDetailsContent = document.getElementById("patientDetailsContent");
const closePatientDetails = document.getElementById("closePatientDetails");

const logoutBtn = document.getElementById("logoutBtn");


// 3. STORAGE HELPER
function readStorage(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Storage error:", error);
        return [];
    }
}


// 4. GET LOGGED-IN DOCTOR
function getLoggedInDoctor() {
    try {
        return JSON.parse(
            localStorage.getItem(LOGGED_DOCTOR_KEY) || "null"
        );
    } catch (error) {
        return null;
    }
}

let loggedDoctor = getLoggedInDoctor();


// 5. CHECK LOGIN
if (!loggedDoctor || !loggedDoctor.doctorID) {

    alert("Please login as a doctor first.");

    window.location.href = "../doctor-login.html";

}


// 6. GET LATEST DOCTOR INFORMATION
const doctors = readStorage(DOCTOR_STORAGE_KEY);

const currentDoctor = doctors.find(
    doctor => doctor.doctorID === loggedDoctor.doctorID
);

if (currentDoctor) {

    loggedDoctor = {
        ...loggedDoctor,
        fullName: currentDoctor.fullName,
        specialization: currentDoctor.specialization,
        qualification: currentDoctor.qualification,
        email: currentDoctor.email,
        phone: currentDoctor.phone,
        availability: currentDoctor.availability
    };

    localStorage.setItem(
        LOGGED_DOCTOR_KEY,
        JSON.stringify(loggedDoctor)
    );

}


// 7. DISPLAY DOCTOR INFORMATION
function displayDoctorInformation() {

    const name = loggedDoctor.fullName || "Doctor";

    if (doctorNameElement) {
        doctorNameElement.textContent = name;
    }

    if (welcomeDoctorName) {
        welcomeDoctorName.textContent = name;
    }

    if (currentDoctor) {
        const welcomeText = document.querySelector(
            ".welcome-section p"
        );

        if (welcomeText) {
            welcomeText.textContent =
                "Specialization: " +
                (loggedDoctor.specialization || "Not specified") +
                " | Manage your patients and view their medical information.";
        }
    }

}


// 8. DISPLAY DOCTOR AVAILABILITY
function displayAvailability() {

    const status = loggedDoctor.availability || "Not Set";

    if (doctorAvailabilityElement) {
        doctorAvailabilityElement.textContent = status;
    }

    if (availabilityText) {
        availabilityText.textContent =
            "Your current availability status is: " + status;
    }

}


// 9. GET REGISTERED PATIENTS
function getPatients() {

    return readStorage(PATIENT_STORAGE_KEY).filter(patient =>
        patient &&
        patient.patientID
    );

}


// 10. GET PATIENT NAME
function getPatientName(patient) {

    return patient.fullName || patient.name || "Unknown Patient";

}


// 11. MATCH DOCTOR NAME
function isAssignedToDoctor(record) {

    if (!record || !record.doctorName) {
        return false;
    }

    const recordDoctorName = String(record.doctorName)
        .trim()
        .toLowerCase();

    const loggedDoctorName = String(loggedDoctor.fullName || "")
        .trim()
        .toLowerCase();

    return recordDoctorName === loggedDoctorName;

}


// 12. GET ASSIGNED PATIENTS
function getAssignedPatients() {

    const patients = getPatients();

    const healthRecords = readStorage(HEALTH_STORAGE_KEY);
    const prescriptions = readStorage(PRESCRIPTION_STORAGE_KEY);

    // Find patients assigned through health records
    // or prescriptions created by this doctor.

    const assignedPatientIDs = new Set();

    healthRecords.forEach(record => {

        if (isAssignedToDoctor(record)) {
            assignedPatientIDs.add(String(record.patientID));
        }

    });

    prescriptions.forEach(record => {

        if (isAssignedToDoctor(record)) {
            assignedPatientIDs.add(String(record.patientID));
        }

    });

    return patients
        .filter(patient =>
            assignedPatientIDs.has(String(patient.patientID))
        )
        .map(patient => {

            const patientRecords = healthRecords.filter(
                record =>
                    String(record.patientID) === String(patient.patientID) &&
                    isAssignedToDoctor(record)
            );

            const latestRecord = patientRecords.length
                ? patientRecords[patientRecords.length - 1]
                : {};

            return {
                ...patient,

                displayAge:
                    latestRecord.age ??
                    patient.age ??
                    "Not provided",

                displayGender:
                    latestRecord.gender ||
                    patient.gender ||
                    "Not provided"
            };

        });

}


// 13. SAFE HTML TEXT
function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// 14. DISPLAY PATIENTS
function displayPatients(searchValue = "") {

    const patients = getAssignedPatients();

    const search = searchValue.trim().toLowerCase();

    const filteredPatients = patients.filter(patient => {

        const name = getPatientName(patient).toLowerCase();

        const id = String(patient.patientID).toLowerCase();

        const phone = String(
            patient.phone ||
            patient.mobile ||
            patient.phoneNumber ||
            ""
        ).toLowerCase();

        return (
            name.includes(search) ||
            id.includes(search) ||
            phone.includes(search)
        );

    });

    if (totalPatientsElement) {
        totalPatientsElement.textContent = patients.length;
    }

    if (!patientTableBody) return;

    patientTableBody.innerHTML = "";

    if (filteredPatients.length === 0) {

        const row = document.createElement("tr");

        const cell = document.createElement("td");

        cell.colSpan = 6;

        cell.textContent = search
            ? "No matching patients found."
            : "No patients assigned to you yet.";

        row.appendChild(cell);
        patientTableBody.appendChild(row);

        return;
    }

    filteredPatients.forEach(patient => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(patient.patientID)}</td>

            <td>${escapeHTML(getPatientName(patient))}</td>

            <td>${escapeHTML(patient.displayAge)}</td>

            <td>${escapeHTML(patient.displayGender)}</td>

            <td>${escapeHTML(
                patient.phone ||
                patient.mobile ||
                patient.phoneNumber ||
                "Not provided"
            )}</td>

            <td>
                <button
                    type="button"
                    class="view-patient-btn"
                    data-patient-id="${escapeHTML(patient.patientID)}"
                >
                    View
                </button>
            </td>
        `;

        patientTableBody.appendChild(row);

    });

}


// 15. DISPLAY RECORD DETAILS
function createRecordDetails(records, fields, emptyMessage) {

    if (records.length === 0) {
        return `<p>${escapeHTML(emptyMessage)}</p>`;
    }

    return records.map(record => {

        let html = `<div class="health-record-card">`;

        fields.forEach(([label, key]) => {

            html += `
                <p>
                    <strong>${escapeHTML(label)}:</strong>
                    ${escapeHTML(record[key] || "Not provided")}
                </p>
            `;

        });

        html += `</div>`;

        return html;

    }).join("");

}


// 16. VIEW PATIENT DETAILS
function viewPatientDetails(patientID) {

    const patient = getPatients().find(
        item => String(item.patientID) === String(patientID)
    );

    if (!patient) {
        alert("Patient information not found.");
        return;
    }

    const healthRecords = readStorage(HEALTH_STORAGE_KEY)
        .filter(record =>
            String(record.patientID) === String(patientID)
        );

    const prescriptions = readStorage(PRESCRIPTION_STORAGE_KEY)
        .filter(record =>
            String(record.patientID) === String(patientID)
        );

    const vaccinations = readStorage(VACCINATION_STORAGE_KEY)
        .filter(record =>
            String(record.patientID) === String(patientID)
        );

    const latestHealthRecord = healthRecords.length
        ? healthRecords[healthRecords.length - 1]
        : {};

    const age =
        latestHealthRecord.age ??
        patient.age ??
        "Not provided";

    const gender =
        latestHealthRecord.gender ||
        patient.gender ||
        "Not provided";

    let html = `

        <div class="health-record-card">

            <h3>Patient Information</h3>

            <p><strong>Patient ID:</strong>
                ${escapeHTML(patient.patientID)}
            </p>

            <p><strong>Patient Name:</strong>
                ${escapeHTML(getPatientName(patient))}
            </p>

            <p><strong>Age:</strong>
                ${escapeHTML(age)}
            </p>

            <p><strong>Gender:</strong>
                ${escapeHTML(gender)}
            </p>

            <p><strong>Phone:</strong>
                ${escapeHTML(
                    patient.phone ||
                    patient.mobile ||
                    patient.phoneNumber ||
                    "Not provided"
                )}
            </p>

            <p><strong>Email:</strong>
                ${escapeHTML(patient.email || "Not provided")}
            </p>

        </div>


        <h3>Health Records</h3>

        ${createRecordDetails(
            healthRecords,
            [
                ["Record ID", "recordID"],
                ["Medical History", "medicalHistory"],
                ["Allergies", "allergies"],
                ["Diagnosis", "diagnosis"],
                ["Treatment Details", "treatmentDetails"],
                ["Doctor Name", "doctorName"],
                ["Visit Date", "visitDate"],
                ["Additional Remarks", "remarks"]
            ],
            "No health records available."
        )}


        <h3>Prescription History</h3>

        ${createRecordDetails(
            prescriptions,
            [
                ["Prescription ID", "prescriptionID"],
                ["Doctor Name", "doctorName"],
                ["Medicine Name", "medicineName"],
                ["Dosage", "dosage"],
                ["Frequency", "frequency"],
                ["Duration", "duration"],
                ["Instructions", "instructions"],
                ["Prescription Date", "prescriptionDate"],
                ["Authorization Status", "authorizationStatus"]
            ],
            "No prescriptions available."
        )}


        <h3>Vaccination History</h3>

        ${createRecordDetails(
            vaccinations,
            [
                ["Vaccination ID", "vaccinationID"],
                ["Vaccine Name", "vaccineName"],
                ["Dose Number", "doseNumber"],
                ["Vaccination Date", "vaccinationDate"],
                ["Next Vaccination Date", "nextVaccinationDate"],
                ["Vaccination Status", "vaccinationStatus"],
                ["Administered By", "administeredBy"],
                ["Remarks", "remarks"]
            ],
            "No vaccination records available."
        )}

    `;

    patientDetailsContent.innerHTML = html;

    patientDetails.style.display = "block";

    patientDetails.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// 17. PATIENT VIEW BUTTON
if (patientTableBody) {

    patientTableBody.addEventListener("click", function (event) {

        const button = event.target.closest(".view-patient-btn");

        if (!button) return;

        const patientID = button.dataset.patientId;

        viewPatientDetails(patientID);

    });

}


// 18. PATIENT SEARCH
if (patientSearch) {

    patientSearch.addEventListener("input", function () {

        displayPatients(this.value);

    });

}


// 19. CLOSE PATIENT DETAILS
if (closePatientDetails) {

    closePatientDetails.addEventListener("click", function () {

        patientDetails.style.display = "none";

    });

}


// 20. MOBILE SIDEBAR
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

if (menuToggle && sidebar) {

    menuToggle.addEventListener("click", function () {

        sidebar.classList.toggle("active");

    });

}


// 21. SIDEBAR NAVIGATION
document.querySelectorAll(".sidebar nav a").forEach(link => {

    link.addEventListener("click", function (event) {

        const href = this.getAttribute("href");

        if (href === "#") {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

        if (sidebar) {
            sidebar.classList.remove("active");
        }

    });

});


// 22. LOGOUT
if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) return;

        localStorage.removeItem(LOGGED_DOCTOR_KEY);

        window.location.href = "../doctor-login.html";

    });

}


// 23. INITIALIZE DOCTOR DASHBOARD
function initializeDoctorDashboard() {

    displayDoctorInformation();

    displayAvailability();

    displayPatients();

}

initializeDoctorDashboard();
