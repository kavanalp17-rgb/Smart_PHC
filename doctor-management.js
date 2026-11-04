
let doctors = [
    {
        name: "Dr. Ananya Rao",
        specialization: "General Physician",
        email: "ananya@example.com",
        phone: "9876543210",
        status: "Available"
    },
    {
        name: "Dr. Rahul Kumar",
        specialization: "Cardiologist",
        email: "rahul@example.com",
        phone: "9876543211",
        status: "Busy"
    },
    {
        name: "Dr. Sneha Shetty",
        specialization: "Pediatrician",
        email: "sneha@example.com",
        phone: "9876543212",
        status: "Available"
    }
];

function renderDoctors() {
    const table = document.getElementById("doctorTable");
    table.innerHTML = "";

    doctors.forEach((doctor, index) => {
        const row = document.createElement("tr");

        const values = [
            doctor.name,
            doctor.specialization,
            doctor.email,
            doctor.phone
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const statusCell = document.createElement("td");
        const status = document.createElement("span");
        status.className = "status " + doctor.status.toLowerCase();
        status.textContent = doctor.status;
        statusCell.appendChild(status);
        row.appendChild(statusCell);

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "add-btn";
        editButton.onclick = () => editDoctor(index);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "cancel-btn";
        deleteButton.onclick = () => deleteDoctor(index);

        actionCell.append(editButton, deleteButton);
        row.appendChild(actionCell);

        table.appendChild(row);
    });

    updateCounts();
}

function updateCounts() {
    document.getElementById("totalDoctors").textContent = doctors.length;

    document.getElementById("availableDoctors").textContent =
        doctors.filter(d => d.status === "Available").length;

    document.getElementById("busyDoctors").textContent =
        doctors.filter(d => d.status === "Busy").length;

    document.getElementById("offlineDoctors").textContent =
        doctors.filter(d => d.status === "Offline").length;
}

function showDoctorForm() {
    document.getElementById("doctorForm").style.display = "block";
}

function hideDoctorForm() {
    document.getElementById("doctorForm").style.display = "none";
    clearForm();
}

function clearForm() {
    document.getElementById("doctorName").value = "";
    document.getElementById("doctorSpecialization").value = "";
    document.getElementById("doctorEmail").value = "";
    document.getElementById("doctorPhone").value = "";
    document.getElementById("doctorStatus").value = "Available";
}

function addDoctor() {
    const name = document.getElementById("doctorName").value.trim();
    const specialization = document.getElementById("doctorSpecialization").value.trim();
    const email = document.getElementById("doctorEmail").value.trim();
    const phone = document.getElementById("doctorPhone").value.trim();
    const status = document.getElementById("doctorStatus").value;

    if (!name || !specialization || !email || !phone) {
        alert("Please fill in all doctor details.");
        return;
    }

    doctors.push({ name, specialization, email, phone, status });

    renderDoctors();
    clearForm();
    hideDoctorForm();

    alert("Doctor added successfully!");
}

function editDoctor(index) {
    const doctor = doctors[index];

    const name = prompt("Enter doctor name:", doctor.name);
    if (name === null || !name.trim()) return;

    const specialization = prompt("Enter specialization:", doctor.specialization);
    if (specialization === null || !specialization.trim()) return;

    const email = prompt("Enter email:", doctor.email);
    if (email === null || !email.trim()) return;

    const phone = prompt("Enter phone number:", doctor.phone);
    if (phone === null || !phone.trim()) return;

    const status = prompt(
        "Enter availability: Available, Busy or Offline",
        doctor.status
    );

    if (status === null) return;

    const validStatus = ["Available", "Busy", "Offline"];
    const selectedStatus = validStatus.find(
        s => s.toLowerCase() === status.trim().toLowerCase()
    );

    if (!selectedStatus) {
        alert("Please enter Available, Busy or Offline.");
        return;
    }

    doctors[index] = {
        name: name.trim(),
        specialization: specialization.trim(),
        email: email.trim(),
        phone: phone.trim(),
        status: selectedStatus
    };

    renderDoctors();
    alert("Doctor details updated successfully!");
}

function deleteDoctor(index) {
    if (confirm("Are you sure you want to delete this doctor?")) {
        doctors.splice(index, 1);
        renderDoctors();
        alert("Doctor deleted successfully!");
    }
}

document.getElementById("searchDoctor").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();

    document.querySelectorAll("#doctorTable tr").forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(searchValue)
            ? ""
            : "none";
    });
});

renderDoctors();
