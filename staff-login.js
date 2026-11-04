const staffForm = document.querySelector("form");

const staffPassword =
    document.getElementById("staffPassword");

const toggleStaffPassword =
    document.getElementById("toggleStaffPassword");

const staffMessage =
    document.getElementById("staffMessage");


// Show / Hide Password

toggleStaffPassword.addEventListener("click", function () {

    if (staffPassword.type === "password") {

        staffPassword.type = "text";

        toggleStaffPassword.textContent = "🙈";

    } else {

        staffPassword.type = "password";

        toggleStaffPassword.textContent = "👁";

    }

});


// Staff Login

staffForm.addEventListener("submit", function (event) {

    event.preventDefault();

    staffMessage.textContent =
        "PHC Staff login system will be connected to the PHC database.";

    staffMessage.className =
        "login-message show success";

});