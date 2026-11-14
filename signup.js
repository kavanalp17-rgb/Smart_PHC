
const signupForm = document.querySelector("form");
const signupMessage = document.getElementById("signupMessage");

const inputs = signupForm.querySelectorAll("input");

const fullName = inputs[0];
const email = inputs[1];
const phone = inputs[2];
const password = inputs[3];
const confirmPassword = inputs[4];

function showMessage(message, type) {
    signupMessage.textContent = message;
    signupMessage.className = "signup-message show " + type;
}

// Allow only 10 digits
phone.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
});

// Generate unique Patient ID
function generatePatientID() {
    const lastID = Number(localStorage.getItem("smartPHCLastPatientID")) || 0;
    const newID = lastID + 1;

    localStorage.setItem("smartPHCLastPatientID", newID);

    return "PHC" + new Date().getFullYear() +
        String(newID).padStart(4, "0");
}

signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (password.value !== confirmPassword.value) {
        showMessage("Passwords do not match.", "error");
        return;
    }

    if (password.value.length < 6) {
        showMessage("Password must contain at least 6 characters.", "error");
        return;
    }

    if (!/^[0-9]{10}$/.test(phone.value)) {
        showMessage("Please enter a valid 10-digit phone number.", "error");
        return;
    }

    // Get existing patient accounts
    const patients = JSON.parse(
        localStorage.getItem("smartPHCPatients")
    ) || [];

    // Check duplicate email
    const emailExists = patients.some(
        patient => patient.email.toLowerCase() === email.value.trim().toLowerCase()
    );

    if (emailExists) {
        showMessage("This email is already registered. Please login.", "error");
        return;
    }

    // Generate Patient ID
    const patientID = generatePatientID();

    // Create patient account
    const user = {
        patientID: patientID,
        fullName: fullName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        password: password.value
    };

    // Save patient account
    patients.push(user);

    localStorage.setItem(
        "smartPHCPatients",
        JSON.stringify(patients)
    );

    // Save current patient
    localStorage.setItem(
        "smartPHCUser",
        JSON.stringify(user)
    );

    showMessage(
        "Registration successful! Your Patient ID is " + patientID,
        "success"
    );

    setTimeout(function () {
        window.location.assign("patient-login.html");
    }, 3000);
});
