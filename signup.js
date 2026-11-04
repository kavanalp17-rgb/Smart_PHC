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

signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Check password match
    if (password.value !== confirmPassword.value) {
        showMessage("Passwords do not match.", "error");
        return;
    }

    // Check password length
    if (password.value.length < 6) {
        showMessage(
            "Password must contain at least 6 characters.",
            "error"
        );
        return;
    }

    // Check phone number
    if (!/^[0-9]{10}$/.test(phone.value)) {
        showMessage(
            "Please enter a valid 10-digit phone number.",
            "error"
        );
        return;
    }

    // Create account
    const user = {
        fullName: fullName.value,
        email: email.value,
        phone: phone.value,
        password: password.value
    };

    localStorage.setItem(
        "smartPHCUser",
        JSON.stringify(user)
    );

    showMessage(
        "Account created successfully! Redirecting to Login...",
        "success"
    );

    setTimeout(function () {
        window.location.assign("patient-login.html");
    }, 2000);
});