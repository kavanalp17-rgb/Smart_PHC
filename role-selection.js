function selectRole(role) {

    if (role === "patient") {
        window.location.href = "patient-login.html";
    }

    else if (role === "doctor") {
        window.location.href = "doctor-login.html";
    }

    else if (role === "staff") {
        window.location.href = "staff-login.html";
    }

}