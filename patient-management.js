
let patients = [
    {
        id: "PHC001",
        name: "Aarav Kumar",
        age: 35,
        gender: "Male",
        phone: "9876543210",
        address: "Udupi"
    },
    {
        id: "PHC002",
        name: "Ananya Rao",
        age: 28,
        gender: "Female",
        phone: "9876543211",
        address: "Kundapura"
    },
    {
        id: "PHC003",
        name: "Sneha Shetty",
        age: 42,
        gender: "Female",
        phone: "9876543212",
        address: "Manipal"
    }
];

let patientCounter = 4;

function renderPatients() {
    const table = document.getElementById("patientTable");
    table.innerHTML = "";

    patients.forEach((patient, index) => {
        const row = document.createElement("tr");

        [
            patient.id,
            patient.name,
            patient.age,
            patient.gender,
            patient.phone,
            patient.address
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "add-btn";
        editButton.onclick = () => editPatient(index);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "cancel-btn";
        deleteButton.onclick = () => deletePatient(index);

        actionCell.append(editButton, deleteButton);
        row.appendChild(actionCell);

        table.appendChild(row);
    });

    updatePatientCounts();
}

function updatePatientCounts() {
    document.getElementById("totalPatients").textContent = patients.length;

    document.getElementById("malePatients").textContent =
        patients.filter(p => p.gender === "Male").length;

    document.getElementById("femalePatients").textContent =
        patients.filter(p => p.gender === "Female").length;

    const today = new Date().toDateString();

    document.getElementById("todayPatients").textContent =
        patients.filter(p => p.registeredDate === today).length;
}

function showPatientForm() {
    document.getElementById("patientForm").style.display = "block";
}

function hidePatientForm() {
    document.getElementById("patientForm").style.display = "none";
    clearPatientForm();
}

function clearPatientForm() {
    document.getElementById("patientName").value = "";
    document.getElementById("patientAge").value = "";
    document.getElementById("patientGender").value = "";
    document.getElementById("patientPhone").value = "";
    document.getElementById("patientAddress").value = "";
}

function addPatient() {
    const name = document.getElementById("patientName").value.trim();
    const age = Number(document.getElementById("patientAge").value);
    const gender = document.getElementById("patientGender").value;
    const phone = document.getElementById("patientPhone").value.trim();
    const address = document.getElementById("patientAddress").value.trim();

    if (!name || !age || age < 1 || age > 120 ||
        !gender || !/^\d{10}$/.test(phone) || !address) {
        alert("Please enter valid patient details. Phone number must have 10 digits.");
        return;
    }

    patients.push({
        id: "PHC" + String(patientCounter++).padStart(3, "0"),
        name,
        age,
        gender,
        phone,
        address,
        registeredDate: new Date().toDateString()
    });

    renderPatients();
    hidePatientForm();

    alert("Patient registered successfully!");
}

function editPatient(index) {
    const patient = patients[index];

    const name = prompt("Enter patient name:", patient.name);
    if (name === null || !name.trim()) return;

    const ageInput = prompt("Enter patient age:", patient.age);
    if (ageInput === null) return;

    const age = Number(ageInput);
    if (!Number.isInteger(age) || age < 1 || age > 120) {
        alert("Please enter a valid age.");
        return;
    }

    const gender = prompt("Enter gender: Male, Female or Other", patient.gender);
    if (gender === null) return;

    const validGenders = ["Male", "Female", "Other"];
    const selectedGender = validGenders.find(
        g => g.toLowerCase() === gender.trim().toLowerCase()
    );

    if (!selectedGender) {
        alert("Please enter Male, Female or Other.");
        return;
    }

    const phone = prompt("Enter 10-digit phone number:", patient.phone);
    if (phone === null || !/^\d{10}$/.test(phone.trim())) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    const address = prompt("Enter address:", patient.address);
    if (address === null || !address.trim()) return;

    patients[index] = {
        ...patient,
        name: name.trim(),
        age,
        gender: selectedGender,
        phone: phone.trim(),
        address: address.trim()
    };

    renderPatients();
    alert("Patient information updated successfully!");
}

function deletePatient(index) {
    if (confirm("Are you sure you want to delete this patient record?")) {
        patients.splice(index, 1);
        renderPatients();
        alert("Patient record deleted successfully!");
    }
}

document.getElementById("searchPatient").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();

    document.querySelectorAll("#patientTable tr").forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(searchValue)
            ? ""
            : "none";
    });
});

renderPatients();
