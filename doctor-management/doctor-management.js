
// ==============================================
// SMART PHC - DOCTOR MANAGEMENT
// ==============================================

// 1. STORAGE CONFIGURATION

const DOCTOR_STORAGE_KEY = "smartPHCDoctors";

// 2. GET HTML ELEMENTS

const doctorForm = document.getElementById("doctorForm");

const doctorIDInput = document.getElementById("doctorID");
const editDoctorID = document.getElementById("editDoctorID");

const doctorName = document.getElementById("doctorName");
const specialization = document.getElementById("specialization");
const qualification = document.getElementById("qualification");
const doctorEmail = document.getElementById("doctorEmail");
const doctorPhone = document.getElementById("doctorPhone");

const doctorPassword = document.getElementById("doctorPassword");
const confirmPassword = document.getElementById("confirmPassword");

const doctorMessage = document.getElementById("doctorMessage");

const doctorTableBody = document.getElementById("doctorTableBody");
const doctorSearch = document.getElementById("doctorSearch");

const totalDoctors = document.getElementById("totalDoctors");
const totalDoctorsCard = document.getElementById("totalDoctorsCard");

const saveDoctorBtn = document.getElementById("saveDoctorBtn");
const resetDoctorBtn = document.getElementById("resetDoctorBtn");

// AVAILABILITY POPUP ELEMENTS

const doctorPopupOverlay = document.getElementById("doctorPopupOverlay");
const doctorPopupList = document.getElementById("doctorPopupList");

const closeDoctorPopup = document.getElementById("closeDoctorPopup");

const availabilitySection = document.getElementById("availabilitySection");
const selectedDoctorName = document.getElementById("selectedDoctorName");

const availableBtn = document.getElementById("availableBtn");
const unavailableBtn = document.getElementById("unavailableBtn");

const availabilityMessage = document.getElementById("availabilityMessage");

let selectedDoctorID = null;


// 3. STORAGE HELPERS

function getDoctors() {

    try {

        const doctors = JSON.parse(
            localStorage.getItem(DOCTOR_STORAGE_KEY) || "[]"
        );

        return Array.isArray(doctors) ? doctors : [];

    } catch (error) {

        console.error("Doctor storage error:", error);

        return [];
    }
}


function saveDoctors(doctors) {

    try {

        localStorage.setItem(
            DOCTOR_STORAGE_KEY,
            JSON.stringify(doctors)
        );

        return true;

    } catch (error) {

        console.error("Doctor saving error:", error);

        showMessage("Unable to save doctor details.", "error");

        return false;
    }
}


// 4. GENERATE UNIQUE DOCTOR ID

function generateDoctorID() {

    const doctors = getDoctors();

    let id;

    do {

        id = "DOC" + Date.now().toString().slice(-8);

    } while (
        doctors.some(doctor => doctor.doctorID === id)
    );

    return id;
}


// 5. DISPLAY MESSAGES

function showMessage(message, type) {

    doctorMessage.textContent = message;

    doctorMessage.className = "message " + type;
}


// 6. CLEAR MESSAGES

function clearMessage() {

    doctorMessage.textContent = "";

    doctorMessage.className = "message";
}


// 7. UPDATE DOCTOR COUNT

function updateDoctorCount() {

    const doctors = getDoctors();

    totalDoctors.textContent = doctors.length;
}


// 8. ESCAPE HTML

function escapeHTML(value) {

    return String(value ?? "").replace(
        /[&<>"']/g,
        character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[character]
    );
}


// 9. DISPLAY REGISTERED DOCTORS

function displayDoctors(searchValue = "") {

    const doctors = getDoctors();

    const search = searchValue.trim().toLowerCase();

    const filteredDoctors = doctors.filter(doctor => {

        return (

            String(doctor.doctorID || "").toLowerCase().includes(search) ||

            String(doctor.fullName || "").toLowerCase().includes(search) ||

            String(doctor.specialization || "").toLowerCase().includes(search)

        );
    });

    doctorTableBody.innerHTML = "";

    updateDoctorCount();

    if (filteredDoctors.length === 0) {

        const row = document.createElement("tr");

        const cell = document.createElement("td");

        cell.colSpan = 7;

        cell.textContent = doctors.length === 0
            ? "No doctors registered yet."
            : "No matching doctors found.";

        row.appendChild(cell);

        doctorTableBody.appendChild(row);

        return;
    }

    filteredDoctors.forEach(doctor => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${escapeHTML(doctor.doctorID)}</td>

            <td>${escapeHTML(doctor.fullName)}</td>

            <td>${escapeHTML(doctor.specialization)}</td>

            <td>${escapeHTML(doctor.qualification)}</td>

            <td>${escapeHTML(doctor.email)}</td>

            <td>${escapeHTML(doctor.phone)}</td>

            <td>

                <button
                    type="button"
                    class="action-btn edit-btn"
                    data-action="edit"
                    data-id="${escapeHTML(doctor.doctorID)}">

                    Edit

                </button>

                <button
                    type="button"
                    class="action-btn delete-btn"
                    data-action="delete"
                    data-id="${escapeHTML(doctor.doctorID)}">

                    Delete

                </button>

            </td>

        `;

        doctorTableBody.appendChild(row);
    });
}


// 10. CHECK DUPLICATE EMAIL AND PHONE

function isDuplicateDoctor(email, phone, currentID = "") {

    const doctors = getDoctors();

    return doctors.some(doctor => {

        if (doctor.doctorID === currentID) {
            return false;
        }

        const sameEmail =
            String(doctor.email || "").toLowerCase() === email.toLowerCase();

        const samePhone =
            String(doctor.phone || "") === phone;

        return sameEmail || samePhone;
    });
}


// 11. RESET FORM

function resetDoctorForm() {

    doctorForm.reset();

    editDoctorID.value = "";

    doctorIDInput.value = "";

    doctorPassword.required = true;

    confirmPassword.required = true;

    doctorPassword.placeholder = "Create login password";

    confirmPassword.placeholder = "Confirm password";

    doctorPassword.autocomplete = "new-password";

    confirmPassword.autocomplete = "new-password";

    saveDoctorBtn.textContent = "Register Doctor";

    clearMessage();
}


// 12. REGISTER / UPDATE DOCTOR

doctorForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = doctorName.value.trim();

    const doctorSpecialization = specialization.value.trim();

    const doctorQualification = qualification.value.trim();

    const email = doctorEmail.value.trim().toLowerCase();

    const phone = doctorPhone.value.trim();

    const password = doctorPassword.value;

    const confirm = confirmPassword.value;

    const currentID = editDoctorID.value;

    const doctors = getDoctors();


    // Check required information

    if (
        !name ||
        !doctorSpecialization ||
        !doctorQualification ||
        !email ||
        !phone
    ) {

        showMessage(
            "Please fill in all required doctor details.",
            "error"
        );

        return;
    }


    // Validate phone number

    if (!/^\d{10}$/.test(phone)) {

        showMessage(
            "Please enter a valid 10-digit phone number.",
            "error"
        );

        return;
    }


    // Check duplicate email or phone

    if (isDuplicateDoctor(email, phone, currentID)) {

        showMessage(
            "Email address or phone number is already registered.",
            "error"
        );

        return;
    }


    // Find existing doctor

    const existingDoctor = currentID
        ? doctors.find(doctor => doctor.doctorID === currentID)
        : null;


    if (currentID && !existingDoctor) {

        showMessage(
            "Doctor record not found. Please refresh and try again.",
            "error"
        );

        return;
    }


    // Validate password

    if (!currentID && !password) {

        showMessage(
            "Please create a login password.",
            "error"
        );

        return;
    }


    if (password && password.length < 8) {

        showMessage(
            "Password must contain at least 8 characters.",
            "error"
        );

        return;
    }


    // Confirm password

    if (password !== confirm) {

        showMessage(
            "Passwords do not match.",
            "error"
        );

        return;
    }


    // CREATE DOCTOR OBJECT

    const doctor = {

        doctorID: currentID || generateDoctorID(),

        fullName: name,

        specialization: doctorSpecialization,

        qualification: doctorQualification,

        email: email,

        phone: phone,

        password: password || existingDoctor?.password || "",

        // Keep existing availability during editing.
        // New doctors are Available by default.

        availability: existingDoctor?.availability || "Available",

        createdAt: existingDoctor?.createdAt || new Date().toISOString(),

        updatedAt: new Date().toISOString()
    };


    if (currentID) {

        // UPDATE EXISTING DOCTOR

        const index = doctors.findIndex(
            item => item.doctorID === currentID
        );

        doctors[index] = doctor;

    } else {

        // REGISTER NEW DOCTOR

        doctors.push(doctor);
    }


    // SAVE DOCTOR INFORMATION

    if (!saveDoctors(doctors)) {
        return;
    }


    if (currentID) {

        showMessage(
            "Doctor details updated successfully!",
            "success"
        );

    } else {

        showMessage(
            "Doctor registered successfully! Doctor ID: " + doctor.doctorID,
            "success"
        );
    }


    displayDoctors(doctorSearch.value);

    doctorForm.reset();

    editDoctorID.value = "";

    doctorIDInput.value = "";

    doctorPassword.required = true;

    confirmPassword.required = true;

    saveDoctorBtn.textContent = "Register Doctor";

});


// 13. SEARCH DOCTORS

doctorSearch.addEventListener("input", function() {

    displayDoctors(this.value);

});


// 14. EDIT AND DELETE DOCTORS

doctorTableBody.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const doctorID = button.dataset.id;

    const action = button.dataset.action;

    const doctors = getDoctors();

    const doctor = doctors.find(
        item => item.doctorID === doctorID
    );


    if (!doctor) {

        showMessage(
            "Doctor record not found.",
            "error"
        );

        return;
    }


    // EDIT DOCTOR

    if (action === "edit") {

        editDoctorID.value = doctor.doctorID;

        doctorIDInput.value = doctor.doctorID;

        doctorName.value = doctor.fullName;

        specialization.value = doctor.specialization;

        qualification.value = doctor.qualification;

        doctorEmail.value = doctor.email;

        doctorPhone.value = doctor.phone;

        doctorPassword.value = "";

        confirmPassword.value = "";

        doctorPassword.required = false;

        confirmPassword.required = false;

        doctorPassword.placeholder =
            "Leave blank to keep current password";

        confirmPassword.placeholder =
            "Enter only if changing password";

        saveDoctorBtn.textContent = "Update Doctor";

        clearMessage();

        doctorForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    // DELETE DOCTOR

    else if (action === "delete") {

        const confirmDelete = confirm(
            "Are you sure you want to delete " +
            doctor.fullName + "?"
        );

        if (!confirmDelete) return;

        const updatedDoctors = doctors.filter(
            item => item.doctorID !== doctorID
        );

        if (!saveDoctors(updatedDoctors)) {
            return;
        }

        if (editDoctorID.value === doctorID) {
            resetDoctorForm();
        }

        displayDoctors(doctorSearch.value);

        showMessage(
            "Doctor deleted successfully!",
            "success"
        );
    }

});


// 15. CLEAR FORM BUTTON

resetDoctorBtn.addEventListener("click", function(event) {

    event.preventDefault();

    resetDoctorForm();

});


// ==============================================
// 16. DOCTOR AVAILABILITY MANAGEMENT
// ==============================================


// OPEN DOCTOR POPUP

function openDoctorPopup() {

    const doctors = getDoctors();

    doctorPopupList.innerHTML = "";

    availabilitySection.style.display = "none";

    availabilityMessage.textContent = "";

    selectedDoctorID = null;


    if (doctors.length === 0) {

        doctorPopupList.innerHTML = `
            <p class="no-doctors-message">
                No doctors registered yet.
            </p>
        `;

    } else {

        doctors.forEach(doctor => {

            const currentStatus = doctor.availability || "Available";

            const doctorButton = document.createElement("button");

            doctorButton.type = "button";

            doctorButton.className = "doctor-name-btn";

            doctorButton.dataset.id = doctor.doctorID;

            doctorButton.innerHTML = `

                <span>
                    👨‍⚕️ ${escapeHTML(doctor.fullName)}
                </span>

                <span class="doctor-status ${
                    currentStatus === "Available"
                        ? "status-available"
                        : "status-unavailable"
                }">

                    ${escapeHTML(currentStatus)}

                </span>

            `;

            doctorPopupList.appendChild(doctorButton);

        });
    }


    doctorPopupOverlay.style.display = "flex";
}


// CLICK TOTAL DOCTORS CARD

totalDoctorsCard.addEventListener("click", function() {

    openDoctorPopup();

});


// SELECT DOCTOR NAME

doctorPopupList.addEventListener("click", function(event) {

    const button = event.target.closest(".doctor-name-btn");

    if (!button) return;

    selectedDoctorID = button.dataset.id;

    const doctors = getDoctors();

    const doctor = doctors.find(
        item => item.doctorID === selectedDoctorID
    );

    if (!doctor) return;


    selectedDoctorName.textContent = doctor.fullName;

    availabilitySection.style.display = "block";

    availabilityMessage.textContent =
        "Current status: " + (doctor.availability || "Available");

});


// UPDATE AVAILABILITY

function updateDoctorAvailability(status) {

    if (!selectedDoctorID) {

        availabilityMessage.textContent =
            "Please select a doctor first.";

        return;
    }

    const doctors = getDoctors();

    const doctorIndex = doctors.findIndex(
        doctor => doctor.doctorID === selectedDoctorID
    );

    if (doctorIndex === -1) {

        availabilityMessage.textContent =
            "Doctor record not found.";

        return;
    }


    // UPDATE STATUS

    doctors[doctorIndex].availability = status;

    doctors[doctorIndex].updatedAt = new Date().toISOString();


    // SAVE STATUS

    if (!saveDoctors(doctors)) {
        return;
    }


    availabilityMessage.textContent =
        doctors[doctorIndex].fullName +
        " is now " + status + ".";


    // Refresh popup list

    openDoctorPopup();

    selectedDoctorID = doctors[doctorIndex].doctorID;

    selectedDoctorName.textContent =
        doctors[doctorIndex].fullName;

    availabilitySection.style.display = "block";

    availabilityMessage.textContent =
        doctors[doctorIndex].fullName +
        " is now " + status + ".";

}


// AVAILABLE BUTTON

availableBtn.addEventListener("click", function() {

    updateDoctorAvailability("Available");

});


// UNAVAILABLE BUTTON

unavailableBtn.addEventListener("click", function() {

    updateDoctorAvailability("Unavailable");

});


// CLOSE POPUP

closeDoctorPopup.addEventListener("click", function() {

    doctorPopupOverlay.style.display = "none";

    selectedDoctorID = null;

});


// CLOSE POPUP WHEN CLICKING OUTSIDE

doctorPopupOverlay.addEventListener("click", function(event) {

    if (event.target === doctorPopupOverlay) {

        doctorPopupOverlay.style.display = "none";

        selectedDoctorID = null;
    }

});


// ==============================================
// 17. INITIALIZE DOCTOR MANAGEMENT
// ==============================================

function initializeDoctorManagement() {

    displayDoctors();

    updateDoctorCount();

    resetDoctorForm();

    console.log("SMART PHC Doctor Management initialized.");

}

initializeDoctorManagement();
