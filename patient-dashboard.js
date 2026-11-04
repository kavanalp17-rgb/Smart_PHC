// Get saved patient information
const savedUser = JSON.parse(
    localStorage.getItem("smartPHCUser")
);


// Show patient's name
if (savedUser && savedUser.fullName) {
    document.getElementById("patientName").textContent =
        savedUser.fullName;
}


// Logout
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {

    localStorage.removeItem("smartPHCUser");

window.location.href = "patient-dashboard.html";
});