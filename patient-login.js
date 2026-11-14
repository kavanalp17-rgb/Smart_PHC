
const loginForm = document.querySelector("form");
const loginMessage = document.createElement("div");

loginMessage.className = "login-message";
loginForm.appendChild(loginMessage);

// Password Show / Hide
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {
    if (password.type === "password") {
        password.type = "text";
        togglePassword.textContent = "🙈";
    } else {
        password.type = "password";
        togglePassword.textContent = "👁";
    }
});
// Automatically fetch Patient ID after signup
const patientIDInput = document.getElementById("patientID");

const currentPatient = JSON.parse(
    localStorage.getItem("smartPHCUser")
);

if (currentPatient && currentPatient.patientID) {
    patientIDInput.value = currentPatient.patientID;
}

// Patient Login
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

   const patientID = patientIDInput.value.trim().toUpperCase();
    const passwordValue = password.value;

    // Get all registered patients
    const patients = JSON.parse(
        localStorage.getItem("smartPHCPatients")
    ) || [];

    // Find patient using Patient ID
    const savedUser = patients.find(
        patient => patient.patientID === patientID
    );

    // Check whether Patient ID exists
    if (!savedUser) {
        showMessage(
            "Patient ID not found. Please sign up first.",
            "error"
        );
        return;
    }

    // Check password
    if (passwordValue !== savedUser.password) {
        showMessage(
            "Incorrect password. Please try again.",
            "error"
        );
        return;
    }

    // Save logged-in patient
    localStorage.setItem(
        "smartPHCUser",
        JSON.stringify(savedUser)
    );

    showMessage(
        "Login successful! Redirecting...",
        "success"
    );

    setTimeout(function () {
        window.location.href = "patient-dashboard.html";
    }, 1500);
});

// Display Message
function showMessage(message, type) {
    loginMessage.textContent = message;
    loginMessage.className =
        "login-message show " + type;
}
