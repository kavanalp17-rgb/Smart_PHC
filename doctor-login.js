const doctorForm = document.querySelector("form");

const doctorPassword = document.getElementById("doctorPassword");
const toggleDoctorPassword = document.getElementById("toggleDoctorPassword");

const doctorMessage = document.getElementById("doctorMessage");

// Show / Hide Password
toggleDoctorPassword.addEventListener("click", function () {

    if (doctorPassword.type === "password") {
        doctorPassword.type = "text";
        toggleDoctorPassword.textContent = "🙈";
    } else {
        doctorPassword.type = "password";
        toggleDoctorPassword.textContent = "👁";
    }

});

// Doctor Login
doctorForm.addEventListener("submit", function (event) {

    event.preventDefault();

    doctorMessage.textContent =
        "Doctor login system will be connected to the PHC database.";

    doctorMessage.className =
        "login-message show success";

});