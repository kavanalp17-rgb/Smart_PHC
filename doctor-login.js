
// ==============================================
// SMART PHC - DOCTOR LOGIN
// ==============================================

// 1. GET HTML ELEMENTS
const doctorForm = document.getElementById("doctorLoginForm");

const doctorEmailPhone = document.getElementById("doctorEmailPhone");
const doctorPassword = document.getElementById("doctorPassword");

const toggleDoctorPassword = document.getElementById("toggleDoctorPassword");
const doctorMessage = document.getElementById("doctorMessage");


// 2. SHOW / HIDE PASSWORD
if (toggleDoctorPassword && doctorPassword) {

    toggleDoctorPassword.addEventListener("click", function () {

        if (doctorPassword.type === "password") {
            doctorPassword.type = "text";
            toggleDoctorPassword.textContent = "🙈";
        } else {
            doctorPassword.type = "password";
            toggleDoctorPassword.textContent = "👁";
        }

    });

}


// 3. DISPLAY LOGIN MESSAGE
function showDoctorMessage(message, type) {

    doctorMessage.textContent = message;
    doctorMessage.className = "login-message show " + type;

}


// 4. DOCTOR LOGIN
if (doctorForm) {

    doctorForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const loginValue = doctorEmailPhone.value.trim().toLowerCase();
        const passwordValue = doctorPassword.value;

        if (!loginValue || !passwordValue) {
            showDoctorMessage(
                "Please enter your email/phone and password.",
                "error"
            );
            return;
        }

        // GET REGISTERED DOCTORS
        let doctors = [];

        try {
            doctors = JSON.parse(
                localStorage.getItem("smartPHCDoctors") || "[]"
            );

            if (!Array.isArray(doctors)) {
                doctors = [];
            }

        } catch (error) {

            console.error("Doctor storage error:", error);

            showDoctorMessage(
                "Unable to access doctor records. Please try again.",
                "error"
            );

            return;
        }


        // FIND DOCTOR
        const doctor = doctors.find(item => {

            const email = String(item.email || "")
                .trim()
                .toLowerCase();

            const phone = String(item.phone || "")
                .trim()
                .toLowerCase();

            return (
                (email === loginValue || phone === loginValue) &&
                item.password === passwordValue
            );

        });


        // INVALID CREDENTIALS
        if (!doctor) {

            showDoctorMessage(
                "Invalid email/phone or password.",
                "error"
            );

            return;
        }


        // SAVE LOGGED-IN DOCTOR DETAILS
        const loggedInDoctor = {
            doctorID: doctor.doctorID,
            fullName: doctor.fullName,
            specialization: doctor.specialization,
            qualification: doctor.qualification,
            email: doctor.email,
            phone: doctor.phone,
            availability: doctor.availability
        };

        localStorage.setItem(
            "smartPHCLoggedInDoctor",
            JSON.stringify(loggedInDoctor)
        );


        // SUCCESS MESSAGE
        showDoctorMessage(
            "Login successful! Redirecting to dashboard...",
            "success"
        );


        // REDIRECT TO DOCTOR DASHBOARD
        window.location.href = "doctor/doctor-dashboard.html";

    });

}
