const loginForm = document.querySelector("form");
const loginMessage = document.createElement("div");

loginMessage.className = "login-message";
loginForm.appendChild(loginMessage);


// =========================
// PASSWORD SHOW / HIDE
// =========================

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


// =========================
// LOGIN
// =========================

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const inputs = loginForm.querySelectorAll("input");

    const emailPhone = inputs[0].value.trim();
    const passwordValue = password.value;

    const savedUser = JSON.parse(
        localStorage.getItem("smartPHCUser")
    );

    // No account found
    if (!savedUser) {
        showMessage(
            "No account found. Please Sign Up first.",
            "error"
        );
        return;
    }

    // Check email/phone and password
    const validUser =
        (emailPhone === savedUser.email ||
         emailPhone === savedUser.phone) &&
        passwordValue === savedUser.password;

    if (!validUser) {
        showMessage(
            "Invalid email/phone or password.",
            "error"
        );
        return;
    }

    // Successful login
    showMessage(
        "Login successful! Redirecting...",
        "success"
    );

    setTimeout(() => {
        window.location.href = "patient-dashboard.html";
    }, 1500);
});


// =========================
// MESSAGE
// =========================

function showMessage(message, type) {
    loginMessage.textContent = message;
    loginMessage.className =
        "login-message show " + type;
}