const resetForm = document.getElementById("resetForm");

const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

const successMessage = document.getElementById("successMessage");

resetForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (newPassword.value !== confirmPassword.value) {
        successMessage.textContent = "Passwords do not match.";
        successMessage.style.color = "#ff8a8a";
        successMessage.style.background = "rgba(255, 80, 80, 0.12)";
        successMessage.style.borderColor = "rgba(255, 100, 100, 0.35)";
        successMessage.classList.add("show");
        return;
    }

    if (newPassword.value.length < 6) {
        successMessage.textContent =
            "Password must contain at least 6 characters.";

        successMessage.style.color = "#ffcc80";
        successMessage.style.background = "rgba(255, 180, 60, 0.12)";
        successMessage.style.borderColor = "rgba(255, 180, 60, 0.35)";
        successMessage.classList.add("show");
        return;
    }

    successMessage.textContent =
        "Password reset successfully! Redirecting to Login...";

    successMessage.style.color = "#7fffd4";
    successMessage.style.background = "rgba(40, 200, 130, 0.12)";
    successMessage.style.borderColor = "rgba(40, 220, 150, 0.35)";
    successMessage.classList.add("show");

    resetForm.reset();

    setTimeout(() => {
        window.location.href = "login.html";
    }, 2000);
});