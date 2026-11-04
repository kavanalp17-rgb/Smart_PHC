const forgotForm = document.getElementById("forgotForm");
const successMessage = document.getElementById("successMessage");

forgotForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const emailPhone = document.getElementById("emailPhone").value.trim();

    if (emailPhone === "") {
        return;
    }

    successMessage.textContent =
        "Password reset instructions have been sent successfully.";

    successMessage.classList.add("show");

    forgotForm.reset();
});