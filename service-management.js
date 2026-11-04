
let services = [
    {
        id: "S001",
        name: "General Consultation",
        category: "General Healthcare",
        description: "General health checkup and doctor consultation.",
        status: "Active"
    },
    {
        id: "S002",
        name: "Maternal Health Care",
        category: "Maternal Care",
        description: "Healthcare support for pregnant women and mothers.",
        status: "Active"
    },
    {
        id: "S003",
        name: "Child Vaccination",
        category: "Child Healthcare",
        description: "Routine vaccination services for children.",
        status: "Active"
    },
    {
        id: "S004",
        name: "Health Awareness Camps",
        category: "Preventive Care",
        description: "Health awareness and preventive screening programs.",
        status: "Inactive"
    }
];

let serviceCounter = 5;

function renderServices() {
    const table = document.getElementById("serviceTable");
    table.innerHTML = "";

    services.forEach((service, index) => {
        const row = document.createElement("tr");

        [
            service.id,
            service.name,
            service.category,
            service.description
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const statusCell = document.createElement("td");
        const status = document.createElement("span");

        status.className = service.status === "Active"
            ? "status active-status"
            : "status inactive-status";

        status.textContent = service.status;
        statusCell.appendChild(status);
        row.appendChild(statusCell);

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "add-btn";
        editButton.onclick = () => editService(index);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "cancel-btn";
        deleteButton.onclick = () => deleteService(index);

        actionCell.append(editButton, deleteButton);
        row.appendChild(actionCell);

        table.appendChild(row);
    });

    updateServiceCounts();
}

function updateServiceCounts() {
    document.getElementById("totalServices").textContent = services.length;

    document.getElementById("activeServices").textContent =
        services.filter(s => s.status === "Active").length;

    document.getElementById("inactiveServices").textContent =
        services.filter(s => s.status === "Inactive").length;

    document.getElementById("serviceCategories").textContent =
        new Set(services.map(s => s.category)).size;
}

function showServiceForm() {
    document.getElementById("serviceForm").style.display = "block";
}

function hideServiceForm() {
    document.getElementById("serviceForm").style.display = "none";
    clearServiceForm();
}

function clearServiceForm() {
    document.getElementById("serviceName").value = "";
    document.getElementById("serviceCategory").value = "";
    document.getElementById("serviceDescription").value = "";
    document.getElementById("serviceStatus").value = "Active";
}

function addService() {
    const name = document.getElementById("serviceName").value.trim();
    const category = document.getElementById("serviceCategory").value;
    const description = document.getElementById("serviceDescription").value.trim();
    const status = document.getElementById("serviceStatus").value;

    if (!name || !category || !description) {
        alert("Please fill in all service details.");
        return;
    }

    services.push({
        id: "S" + String(serviceCounter++).padStart(3, "0"),
        name,
        category,
        description,
        status
    });

    renderServices();
    hideServiceForm();

    alert("PHC service added successfully!");
}

function editService(index) {
    const service = services[index];

    const name = prompt("Enter service name:", service.name);
    if (name === null || !name.trim()) return;

    const description = prompt(
        "Enter service description:",
        service.description
    );
    if (description === null || !description.trim()) return;

    const status = prompt(
        "Enter status: Active or Inactive",
        service.status
    );

    if (status === null) return;

    const validStatus = ["Active", "Inactive"];
    const selectedStatus = validStatus.find(
        s => s.toLowerCase() === status.trim().toLowerCase()
    );

    if (!selectedStatus) {
        alert("Please enter Active or Inactive.");
        return;
    }

    services[index] = {
        ...service,
        name: name.trim(),
        description: description.trim(),
        status: selectedStatus
    };

    renderServices();
    alert("Service updated successfully!");
}

function deleteService(index) {
    if (confirm("Are you sure you want to delete this service?")) {
        services.splice(index, 1);
        renderServices();
        alert("Service deleted successfully!");
    }
}

document.getElementById("searchService").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();

    document.querySelectorAll("#serviceTable tr").forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(searchValue)
            ? ""
            : "none";
    });
});

renderServices();
