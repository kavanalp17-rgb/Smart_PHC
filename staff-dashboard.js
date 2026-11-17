
// ==============================================
// SMART PHC - STAFF DASHBOARD
// ==============================================

// 1. MOBILE SIDEBAR
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

if (menuToggle && sidebar && sidebarOverlay) {
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("active");
        sidebarOverlay.classList.toggle("active");
    });

    sidebarOverlay.addEventListener("click", () => {
        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");
    });
}

// 2. PATIENT MANAGEMENT SUBMENU
const patientToggle = document.getElementById("patientManagementToggle");
const patientSubmenu = document.getElementById("patientManagementSubmenu");

if (patientToggle && patientSubmenu) {
    patientToggle.addEventListener("click", event => {
        event.preventDefault();
        patientSubmenu.classList.toggle("show");
        patientToggle.classList.toggle("expanded");

        patientToggle.setAttribute(
            "aria-expanded",
            patientSubmenu.classList.contains("show")
        );
    });
}

// 3. CURRENT DATE
const dateElement = document.getElementById("currentDate");

if (dateElement) {
    dateElement.textContent = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

// 4. STORAGE HELPERS
const HEALTH_STORAGE_KEY = "smartPHCHealthRecords";
const PRESCRIPTION_STORAGE_KEY = "smartPHCPrescriptions";
const VACCINATION_STORAGE_KEY = "smartPHCVaccinationRecords";

function readStorage(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(value) ? value : [];
    } catch (error) {
        console.error("Storage reading error:", error);
        return [];
    }
}

function saveStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// 5. REGISTERED PATIENTS
function getRegisteredPatients() {
    return readStorage("smartPHCPatients").filter(patient =>
        patient &&
        patient.patientID &&
        (patient.fullName || patient.name)
    );
}

function getPatientName(patient) {
    return patient.fullName || patient.name || "Unknown Patient";
}

// 6. GENERATE UNIQUE IDs
function generateHealthRecordID() {
    const records = readStorage(HEALTH_STORAGE_KEY);
    let id;

    do {
        id = "HR" + Date.now().toString().slice(-8);
    } while (records.some(record => record.recordID === id));

    return id;
}

function generatePrescriptionID() {
    const records = readStorage(PRESCRIPTION_STORAGE_KEY);
    let id;

    do {
        id = "RX" + Date.now().toString().slice(-8);
    } while (records.some(record => record.prescriptionID === id));

    return id;
}

function generateVaccinationID() {
    const records = readStorage(VACCINATION_STORAGE_KEY);
    let id;

    do {
        id = "VAC" + Date.now().toString().slice(-8);
    } while (records.some(record => record.vaccinationID === id));

    return id;
}

// 7. DISPLAY REGISTERED PATIENTS
function loadPatientsIntoModules() {
    const patients = getRegisteredPatients();
    const modules = document.querySelectorAll(".patient-module");

    modules.forEach(module => {
        const searchInput = module.querySelector(".patient-search");
        const patientSelect = module.querySelector(".patient-select");
        const patientList = module.querySelector(".patient-list");

        if (!patientSelect) return;

        function populateDropdown(filteredPatients) {
            const previousSelection = patientSelect.value;

            patientSelect.innerHTML = "";
            patientSelect.add(
                new Option("Select a registered patient", "")
            );

            filteredPatients.forEach(patient => {
                patientSelect.add(
                    new Option(
                        getPatientName(patient) + " (" + patient.patientID + ")",
                        patient.patientID
                    )
                );
            });

            if (
                previousSelection &&
                filteredPatients.some(
                    patient => patient.patientID === previousSelection
                )
            ) {
                patientSelect.value = previousSelection;
            }
        }

        populateDropdown(patients);

        if (searchInput) {
            searchInput.addEventListener("input", function () {
                const search = this.value.trim().toLowerCase();

                const filtered = patients.filter(patient => {
                    const name = getPatientName(patient).toLowerCase();
                    const id = String(patient.patientID).toLowerCase();

                    return name.includes(search) || id.includes(search);
                });

                populateDropdown(filtered);

                if (patientList) {
                    patientList.textContent =
                        filtered.length + " registered patient(s) found.";
                }
            });
        }

        patientSelect.addEventListener("change", function () {
            const patient = patients.find(
                item => item.patientID === this.value
            );

            const area = module.querySelector(".records-area");

            if (!patient) {
                if (area) {
                    area.textContent =
                        "Select a registered patient to view records.";
                }
                return;
            }

            if (module.dataset.module === "health") {
                renderHealthRecords(patient, module);
            } else if (module.dataset.module === "prescription") {
                renderPrescriptions(patient, module);
            } else if (module.dataset.module === "vaccination") {
                renderVaccinationRecords(patient, module);
            }

            if (patientList) {
                patientList.textContent =
                    "Selected Patient: " + getPatientName(patient) +
                    " | Patient ID: " + patient.patientID;
            }
        });

        if (patientList) {
            patientList.textContent =
                patients.length + " registered patient(s) available.";
        }
    });

    const totalPatients = document.getElementById("totalPatients");

    if (totalPatients) {
        totalPatients.textContent = patients.length;
    }
}

// ==============================================
// 8. HEALTH RECORDS DISPLAY
// ==============================================

function renderHealthRecords(patient, module) {
    const area = module.querySelector(".records-area");
    if (!area) return;

    area.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = "Health Records - " + getPatientName(patient);

    const idText = document.createElement("p");
    idText.textContent = "Patient ID: " + patient.patientID;

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "health-add-button";
    addButton.textContent = "+ Add Health Record";

    addButton.addEventListener("click", () => {
        showHealthRecordForm(patient, module);
    });

    const historyHeading = document.createElement("h3");
    historyHeading.textContent = "Previous Health Records";

    area.append(heading, idText, addButton, historyHeading);

    const records = readStorage(HEALTH_STORAGE_KEY).filter(
        record => record.patientID === patient.patientID
    );

    if (records.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "No health records found for this patient.";
        area.appendChild(empty);
    } else {
        records.forEach(record => {
            const card = document.createElement("div");
            card.className = "health-record-card";

            const title = document.createElement("h4");
            title.textContent = "Health Record: " + record.recordID;
            card.appendChild(title);

            const details = [
                ["Patient Name", record.patientName],
                ["Age", record.age],
                ["Gender", record.gender],
                ["Blood Group", record.bloodGroup],
                ["Medical History", record.medicalHistory],
                ["Allergies", record.allergies],
                ["Diagnosis", record.diagnosis],
                ["Treatment Details", record.treatmentDetails],
                ["Doctor Name", record.doctorName],
                ["Visit Date", record.visitDate],
                ["Additional Remarks", record.remarks]
            ];

            details.forEach(([label, value]) => {
                const paragraph = document.createElement("p");
                const strong = document.createElement("strong");

                strong.textContent = label + ": ";
                paragraph.append(
                    strong,
                    document.createTextNode(value || "Not provided")
                );

                card.appendChild(paragraph);
            });

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Edit Record";
            editButton.className = "health-edit-button";

            editButton.addEventListener("click", () => {
                showHealthRecordForm(patient, module, record);
            });

            card.appendChild(editButton);
            area.appendChild(card);
        });
    }
}

// ==============================================
// 9. ADD / UPDATE HEALTH RECORD FORM
// ==============================================

function showHealthRecordForm(patient, module, existingRecord = null) {
    const area = module.querySelector(".records-area");
    if (!area) return;

    const formContainer = document.createElement("div");
    formContainer.className = "health-form-container";

    const heading = document.createElement("h3");
    heading.textContent = existingRecord
        ? "Update Health Record"
        : "Add New Health Record";

    const form = document.createElement("form");
    form.id = "healthRecordForm";

    function addInput(labelText, name, value = "", type = "text") {
        const wrapper = document.createElement("div");
        wrapper.className = "health-form-group";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.htmlFor = "health-" + name;

        const input = document.createElement("input");
        input.id = "health-" + name;
        input.name = name;
        input.type = type;
        input.value = value || "";

        if (type === "date") {
            input.value = value || new Date().toISOString().slice(0, 10);
        }

        if (name === "age") {
            input.min = "0";
            input.max = "130";
            input.required = true;
        }

        wrapper.append(label, input);
        form.appendChild(wrapper);
    }

    function addTextarea(labelText, name, value = "") {
        const wrapper = document.createElement("div");
        wrapper.className = "health-form-group";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.htmlFor = "health-" + name;

        const textarea = document.createElement("textarea");
        textarea.id = "health-" + name;
        textarea.name = name;
        textarea.rows = 3;
        textarea.value = value || "";

        wrapper.append(label, textarea);
        form.appendChild(wrapper);
    }

    addInput("Patient ID", "patientID", patient.patientID);
    addInput("Patient Name", "patientName", getPatientName(patient));

    const ageValue = existingRecord
        ? existingRecord.age
        : (patient.age ?? "");

    addInput("Age", "age", ageValue, "number");

    // GENDER FIELD
    const genderWrapper = document.createElement("div");
    genderWrapper.className = "health-form-group";

    const genderLabel = document.createElement("label");
    genderLabel.textContent = "Gender";
    genderLabel.htmlFor = "health-gender";

    const genderSelect = document.createElement("select");
    genderSelect.id = "health-gender";
    genderSelect.name = "gender";
    genderSelect.required = true;

    [
        ["", "Select Gender"],
        ["Male", "Male"],
        ["Female", "Female"],
        ["Other", "Other"]
    ].forEach(([value, label]) => {
        genderSelect.add(new Option(label, value));
    });

    genderSelect.value = existingRecord
        ? (existingRecord.gender || "")
        : (patient.gender || "");

    genderWrapper.append(genderLabel, genderSelect);
    form.appendChild(genderWrapper);

    // BLOOD GROUP
    const bloodWrapper = document.createElement("div");
    bloodWrapper.className = "health-form-group";

    const bloodLabel = document.createElement("label");
    bloodLabel.textContent = "Blood Group";
    bloodLabel.htmlFor = "health-bloodGroup";

    const bloodSelect = document.createElement("select");
    bloodSelect.id = "health-bloodGroup";
    bloodSelect.name = "bloodGroup";

    [
        "Select Blood Group", "A+", "A-", "B+", "B-",
        "AB+", "AB-", "O+", "O-"
    ].forEach(group => {
        bloodSelect.add(new Option(group, group));
    });

    bloodSelect.value = existingRecord
        ? (existingRecord.bloodGroup || "Select Blood Group")
        : (patient.bloodGroup || "Select Blood Group");

    bloodWrapper.append(bloodLabel, bloodSelect);
    form.appendChild(bloodWrapper);

    addTextarea("Medical History", "medicalHistory", existingRecord?.medicalHistory);
    addTextarea("Allergies", "allergies", existingRecord?.allergies);
    addTextarea("Diagnosis", "diagnosis", existingRecord?.diagnosis);
    addTextarea("Treatment Details", "treatmentDetails", existingRecord?.treatmentDetails);
    addInput("Doctor Name", "doctorName", existingRecord?.doctorName);
    addInput("Visit Date", "visitDate", existingRecord?.visitDate, "date");
    addTextarea("Additional Remarks", "remarks", existingRecord?.remarks);

    const saveButton = document.createElement("button");
    saveButton.type = "submit";
    saveButton.textContent = existingRecord
        ? "Update Health Record"
        : "Save Health Record";
    saveButton.className = "health-save-button";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.textContent = "Cancel";
    cancelButton.className = "health-cancel-button";

    cancelButton.addEventListener("click", () => {
        renderHealthRecords(patient, module);
    });

    form.append(saveButton, cancelButton);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const data = Object.fromEntries(new FormData(form).entries());
        const records = readStorage(HEALTH_STORAGE_KEY);

        const healthRecord = {
            recordID: existingRecord
                ? existingRecord.recordID
                : generateHealthRecordID(),

            patientID: patient.patientID,
            patientName: getPatientName(patient),
            age: data.age,
            gender: data.gender,
            bloodGroup: data.bloodGroup === "Select Blood Group"
                ? ""
                : data.bloodGroup,
            medicalHistory: data.medicalHistory,
            allergies: data.allergies,
            diagnosis: data.diagnosis,
            treatmentDetails: data.treatmentDetails,
            doctorName: data.doctorName,
            visitDate: data.visitDate,
            remarks: data.remarks,
            updatedAt: new Date().toISOString()
        };

        if (existingRecord) {
            const index = records.findIndex(record =>
                record.recordID === existingRecord.recordID &&
                record.patientID === patient.patientID
            );

            if (index === -1) {
                alert("Record not found. Please refresh and try again.");
                return;
            }

            records[index] = { ...records[index], ...healthRecord };
        } else {
            records.push(healthRecord);
        }

        saveStorage(HEALTH_STORAGE_KEY, records);

        alert(existingRecord
            ? "Health record updated successfully!"
            : "Health record saved successfully!");

        renderHealthRecords(patient, module);
    });

    formContainer.append(heading, form);
    area.appendChild(formContainer);

    formContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// ==============================================
// 10. PRESCRIPTIONS DISPLAY
// ==============================================

function renderPrescriptions(patient, module) {
    const area = module.querySelector(".records-area");
    if (!area) return;

    area.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = "Prescriptions - " + getPatientName(patient);

    const idText = document.createElement("p");
    idText.textContent = "Patient ID: " + patient.patientID;

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "health-add-button";
    addButton.textContent = "+ Add Prescription";

    addButton.addEventListener("click", () => {
        showPrescriptionForm(patient, module);
    });

    const historyHeading = document.createElement("h3");
    historyHeading.textContent = "Previous Prescriptions";

    area.append(heading, idText, addButton, historyHeading);

    const records = readStorage(PRESCRIPTION_STORAGE_KEY).filter(
        record => record.patientID === patient.patientID
    );

    if (records.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "No prescriptions found for this patient.";
        area.appendChild(empty);
        return;
    }

    records.forEach(record => {
        const card = document.createElement("div");
        card.className = "health-record-card";

        const title = document.createElement("h4");
        title.textContent = "Prescription ID: " + record.prescriptionID;
        card.appendChild(title);

        const details = [
            ["Patient Name", record.patientName],
            ["Patient ID", record.patientID],
            ["Doctor Name", record.doctorName],
            ["Medicine Name", record.medicineName],
            ["Dosage", record.dosage],
            ["Frequency", record.frequency],
            ["Duration", record.duration],
            ["Instructions", record.instructions],
            ["Prescription Date", record.prescriptionDate],
            ["Doctor Authorization", record.authorizationStatus]
        ];

        details.forEach(([label, value]) => {
            const paragraph = document.createElement("p");
            const strong = document.createElement("strong");

            strong.textContent = label + ": ";
            paragraph.append(
                strong,
                document.createTextNode(value || "Not provided")
            );

            card.appendChild(paragraph);
        });

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "health-edit-button";
        editButton.textContent = "Edit Prescription";

        editButton.addEventListener("click", () => {
            showPrescriptionForm(patient, module, record);
        });

        card.appendChild(editButton);
        area.appendChild(card);
    });
}

// ==============================================
// 11. ADD / UPDATE PRESCRIPTION FORM
// ==============================================

function showPrescriptionForm(patient, module, existingRecord = null) {
    const area = module.querySelector(".records-area");
    if (!area) return;

    const container = document.createElement("div");
    container.className = "health-form-container";

    const heading = document.createElement("h3");
    heading.textContent = existingRecord
        ? "Update Prescription"
        : "Add New Prescription";

    const form = document.createElement("form");
    form.id = "prescriptionForm";

    function addPrescriptionInput(labelText, name, value = "", type = "text") {
        const wrapper = document.createElement("div");
        wrapper.className = "health-form-group";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.htmlFor = "prescription-" + name;

        const input = document.createElement("input");
        input.id = "prescription-" + name;
        input.name = name;
        input.type = type;
        input.value = value || "";

        if (type === "date") {
            input.value = value || new Date().toISOString().slice(0, 10);
        }

        if (["doctorName", "medicineName", "dosage", "frequency", "duration"].includes(name)) {
            input.required = true;
        }

        wrapper.append(label, input);
        form.appendChild(wrapper);
    }

    function addPrescriptionTextarea(labelText, name, value = "") {
        const wrapper = document.createElement("div");
        wrapper.className = "health-form-group";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.htmlFor = "prescription-" + name;

        const textarea = document.createElement("textarea");
        textarea.id = "prescription-" + name;
        textarea.name = name;
        textarea.rows = 3;
        textarea.value = value || "";

        wrapper.append(label, textarea);
        form.appendChild(wrapper);
    }

    addPrescriptionInput(
        "Prescription ID",
        "prescriptionID",
        existingRecord?.prescriptionID || "Generated automatically"
    );

    addPrescriptionInput("Patient ID", "patientID", patient.patientID);
    addPrescriptionInput("Patient Name", "patientName", getPatientName(patient));

    addPrescriptionInput("Doctor Name", "doctorName", existingRecord?.doctorName);
    addPrescriptionInput("Medicine Name", "medicineName", existingRecord?.medicineName);
    addPrescriptionInput("Dosage", "dosage", existingRecord?.dosage);
    addPrescriptionInput("Frequency", "frequency", existingRecord?.frequency);
    addPrescriptionInput("Duration", "duration", existingRecord?.duration);

    addPrescriptionTextarea("Instructions", "instructions", existingRecord?.instructions);

    addPrescriptionInput(
        "Prescription Date",
        "prescriptionDate",
        existingRecord?.prescriptionDate,
        "date"
    );

    const statusWrapper = document.createElement("div");
    statusWrapper.className = "health-form-group";

    const statusLabel = document.createElement("label");
    statusLabel.textContent = "Doctor Authorization Status";

    const statusSelect = document.createElement("select");
    statusSelect.name = "authorizationStatus";
    statusSelect.required = true;

    [
        "Pending",
        "Authorized by Doctor",
        "Not Authorized"
    ].forEach(status => {
        statusSelect.add(new Option(status, status));
    });

    statusSelect.value = existingRecord?.authorizationStatus || "Pending";

    statusWrapper.append(statusLabel, statusSelect);
    form.appendChild(statusWrapper);

    const note = document.createElement("p");
    note.textContent =
        "Only record prescriptions prescribed or approved by a doctor. Verify the doctor's authorization.";
    form.appendChild(note);

    const saveButton = document.createElement("button");
    saveButton.type = "submit";
    saveButton.className = "health-save-button";
    saveButton.textContent = existingRecord
        ? "Update Prescription"
        : "Save Prescription";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "health-cancel-button";
    cancelButton.textContent = "Cancel";

    cancelButton.addEventListener("click", () => {
        renderPrescriptions(patient, module);
    });

    form.append(saveButton, cancelButton);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const data = Object.fromEntries(new FormData(form).entries());
        const records = readStorage(PRESCRIPTION_STORAGE_KEY);

        const prescription = {
            prescriptionID: existingRecord
                ? existingRecord.prescriptionID
                : generatePrescriptionID(),

            patientID: patient.patientID,
            patientName: getPatientName(patient),
            doctorName: data.doctorName.trim(),
            medicineName: data.medicineName.trim(),
            dosage: data.dosage.trim(),
            frequency: data.frequency.trim(),
            duration: data.duration.trim(),
            instructions: data.instructions.trim(),
            prescriptionDate: data.prescriptionDate,
            authorizationStatus: data.authorizationStatus,
            updatedAt: new Date().toISOString()
        };

        if (existingRecord) {
            const index = records.findIndex(record =>
                record.prescriptionID === existingRecord.prescriptionID &&
                record.patientID === patient.patientID
            );

            if (index === -1) {
                alert("Prescription not found. Please refresh and try again.");
                return;
            }

            records[index] = { ...records[index], ...prescription };
        } else {
            records.push(prescription);
        }

        saveStorage(PRESCRIPTION_STORAGE_KEY, records);

        alert(existingRecord
            ? "Prescription updated successfully!"
            : "Prescription saved successfully!");

        renderPrescriptions(patient, module);
    });

    container.append(heading, form);
    area.appendChild(container);

    container.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// ==============================================
// 12. VACCINATION RECORDS DISPLAY
// ==============================================

function renderVaccinationRecords(patient, module) {
    const area = module.querySelector(".records-area");
    if (!area) return;

    area.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = "Vaccination Records - " + getPatientName(patient);

    const idText = document.createElement("p");
    idText.textContent = "Patient ID: " + patient.patientID;

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "health-add-button";
    addButton.textContent = "+ Add Vaccination Record";

    addButton.addEventListener("click", () => {
        showVaccinationForm(patient, module);
    });

    const historyHeading = document.createElement("h3");
    historyHeading.textContent = "Previous Vaccination Records";

    area.append(heading, idText, addButton, historyHeading);

    const records = readStorage(VACCINATION_STORAGE_KEY).filter(
        record => record.patientID === patient.patientID
    );

    if (records.length === 0) {
        const empty = document.createElement("p");
        empty.textContent =
            "No vaccination records found for this patient.";
        area.appendChild(empty);
        return;
    }

    records.forEach(record => {
        const card = document.createElement("div");
        card.className = "health-record-card";

        const title = document.createElement("h4");
        title.textContent = "Vaccination ID: " + record.vaccinationID;
        card.appendChild(title);

        const details = [
            ["Patient Name", record.patientName],
            ["Patient ID", record.patientID],
            ["Vaccine Name", record.vaccineName],
            ["Dose Number", record.doseNumber],
            ["Vaccination Date", record.vaccinationDate],
            ["Next Vaccination Date", record.nextVaccinationDate],
            ["Vaccination Status", record.vaccinationStatus],
            ["Doctor / Health Worker", record.administeredBy],
            ["Remarks", record.remarks]
        ];

        details.forEach(([label, value]) => {
            const paragraph = document.createElement("p");
            const strong = document.createElement("strong");

            strong.textContent = label + ": ";

            paragraph.append(
                strong,
                document.createTextNode(value || "Not provided")
            );

            card.appendChild(paragraph);
        });

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "health-edit-button";
        editButton.textContent = "Edit Vaccination Record";

        editButton.addEventListener("click", () => {
            showVaccinationForm(patient, module, record);
        });

        card.appendChild(editButton);
        area.appendChild(card);
    });
}

// ==============================================
// 13. ADD / UPDATE VACCINATION FORM
// ==============================================

function showVaccinationForm(patient, module, existingRecord = null) {
    const area = module.querySelector(".records-area");
    if (!area) return;

    const container = document.createElement("div");
    container.className = "health-form-container";

    const heading = document.createElement("h3");
    heading.textContent = existingRecord
        ? "Update Vaccination Record"
        : "Add New Vaccination Record";

    const form = document.createElement("form");
    form.id = "vaccinationForm";

    function addVaccinationInput(labelText, name, value = "", type = "text") {
        const wrapper = document.createElement("div");
        wrapper.className = "health-form-group";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.htmlFor = "vaccination-" + name;

        const input = document.createElement("input");
        input.id = "vaccination-" + name;
        input.name = name;
        input.type = type;
        input.value = value || "";

        if (type === "date" && !value) {
            input.value = new Date().toISOString().slice(0, 10);
        }

        if (["vaccineName", "doseNumber", "vaccinationDate", "administeredBy"].includes(name)) {
            input.required = true;
        }

        wrapper.append(label, input);
        form.appendChild(wrapper);
    }

    function addVaccinationTextarea(labelText, name, value = "") {
        const wrapper = document.createElement("div");
        wrapper.className = "health-form-group";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.htmlFor = "vaccination-" + name;

        const textarea = document.createElement("textarea");
        textarea.id = "vaccination-" + name;
        textarea.name = name;
        textarea.rows = 3;
        textarea.value = value || "";

        wrapper.append(label, textarea);
        form.appendChild(wrapper);
    }

    addVaccinationInput(
        "Vaccination Record ID",
        "vaccinationID",
        existingRecord?.vaccinationID || "Generated automatically"
    );

    addVaccinationInput("Patient ID", "patientID", patient.patientID);
    addVaccinationInput("Patient Name", "patientName", getPatientName(patient));

    addVaccinationInput(
        "Vaccine Name",
        "vaccineName",
        existingRecord?.vaccineName
    );

    addVaccinationInput(
        "Dose Number",
        "doseNumber",
        existingRecord?.doseNumber,
        "number"
    );

    addVaccinationInput(
        "Vaccination Date",
        "vaccinationDate",
        existingRecord?.vaccinationDate,
        "date"
    );

    addVaccinationInput(
        "Next Vaccination Date",
        "nextVaccinationDate",
        existingRecord?.nextVaccinationDate,
        "date"
    );

    const statusWrapper = document.createElement("div");
    statusWrapper.className = "health-form-group";

    const statusLabel = document.createElement("label");
    statusLabel.textContent = "Vaccination Status";
    statusLabel.htmlFor = "vaccination-status";

    const statusSelect = document.createElement("select");
    statusSelect.id = "vaccination-status";
    statusSelect.name = "vaccinationStatus";
    statusSelect.required = true;

    [
        "Scheduled",
        "Completed",
        "Missed",
        "Partially Completed"
    ].forEach(status => {
        statusSelect.add(new Option(status, status));
    });

    statusSelect.value =
        existingRecord?.vaccinationStatus || "Completed";

    statusWrapper.append(statusLabel, statusSelect);
    form.appendChild(statusWrapper);

    addVaccinationInput(
        "Doctor / Health Worker Name",
        "administeredBy",
        existingRecord?.administeredBy
    );

    addVaccinationTextarea(
        "Additional Remarks",
        "remarks",
        existingRecord?.remarks
    );

    const saveButton = document.createElement("button");
    saveButton.type = "submit";
    saveButton.className = "health-save-button";
    saveButton.textContent = existingRecord
        ? "Update Vaccination Record"
        : "Save Vaccination Record";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "health-cancel-button";
    cancelButton.textContent = "Cancel";

    cancelButton.addEventListener("click", () => {
        renderVaccinationRecords(patient, module);
    });

    form.append(saveButton, cancelButton);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const data = Object.fromEntries(new FormData(form).entries());
        const records = readStorage(VACCINATION_STORAGE_KEY);

        const vaccinationRecord = {
            vaccinationID: existingRecord
                ? existingRecord.vaccinationID
                : generateVaccinationID(),

            patientID: patient.patientID,
            patientName: getPatientName(patient),

            vaccineName: data.vaccineName.trim(),
            doseNumber: data.doseNumber,
            vaccinationDate: data.vaccinationDate,
            nextVaccinationDate: data.nextVaccinationDate,
            vaccinationStatus: data.vaccinationStatus,
            administeredBy: data.administeredBy.trim(),
            remarks: data.remarks.trim(),

            updatedAt: new Date().toISOString()
        };

        if (existingRecord) {
            const index = records.findIndex(record =>
                record.vaccinationID === existingRecord.vaccinationID &&
                record.patientID === patient.patientID
            );

            if (index === -1) {
                alert(
                    "Vaccination record not found. Please refresh and try again."
                );
                return;
            }

            records[index] = {
                ...records[index],
                ...vaccinationRecord
            };
        } else {
            records.push(vaccinationRecord);
        }

        saveStorage(VACCINATION_STORAGE_KEY, records);

        alert(existingRecord
            ? "Vaccination record updated successfully!"
            : "Vaccination record saved successfully!");

        renderVaccinationRecords(patient, module);
    });

    container.append(heading, form);
    area.appendChild(container);

    container.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// ==============================================
// 14. PATIENT MODULE NAVIGATION
// ==============================================

const patientLinks = document.querySelectorAll(
    "#patientManagementSubmenu a[href^='#']"
);

const patientModules = document.querySelectorAll(".patient-module");

function openPatientModule(sectionId) {
    patientModules.forEach(section => {
        section.classList.remove("active");
    });

    const selectedModule = document.getElementById(sectionId);

    if (selectedModule) {
        selectedModule.classList.add("active");
        selectedModule.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    patientLinks.forEach(link => {
        link.classList.remove("active");
    });

    const selectedLink = document.querySelector(
        '#patientManagementSubmenu a[href="#' + sectionId + '"]'
    );

    if (selectedLink) {
        selectedLink.classList.add("active");
    }

    if (patientSubmenu) {
        patientSubmenu.classList.add("show");
    }

    if (patientToggle) {
        patientToggle.classList.add("expanded");
        patientToggle.setAttribute("aria-expanded", "true");
    }
}

patientLinks.forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();

        const sectionId = link.getAttribute("href").substring(1);

        history.replaceState(null, "", "#" + sectionId);
        openPatientModule(sectionId);
    });
});

// ==============================================
// 15. INITIALIZE DASHBOARD
// ==============================================

loadPatientsIntoModules();

const initialSection = window.location.hash.substring(1);

if (
    [
        "health-records",
        "prescriptions",
        "vaccination-records"
    ].includes(initialSection)
) {
    openPatientModule(initialSection);
}
