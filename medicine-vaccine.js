
const STORAGE_KEY = "smartPHCInventory";

const defaultInventory = [
    // FIVE MEDICINES
    { name: "Paracetamol", type: "medicine", status: "available" },
    { name: "Amoxicillin", type: "medicine", status: "available" },
    { name: "Vitamin C", type: "medicine", status: "unavailable" },
    { name: "Cetirizine", type: "medicine", status: "available" },
    { name: "ORS", type: "medicine", status: "unavailable" },

    // FIVE VACCINES
    { name: "BCG Vaccine", type: "vaccine", status: "available" },
    { name: "Polio Vaccine", type: "vaccine", status: "available" },
    { name: "Hepatitis B Vaccine", type: "vaccine", status: "unavailable" },
    { name: "DPT Vaccine", type: "vaccine", status: "available" },
    { name: "Measles Vaccine", type: "vaccine", status: "unavailable" }
];

function loadInventory() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (Array.isArray(saved)) {
            return saved;
        }
    } catch (error) {
        console.log("Could not load inventory.");
    }

    return defaultInventory;
}

let inventory = loadInventory();

if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}


// SHOW ONE PAGE AT A TIME

function hideAllPages() {
    document.getElementById("homePage").hidden = true;
    document.getElementById("medicinePage").hidden = true;
    document.getElementById("vaccinePage").hidden = true;
    document.getElementById("updatePage").hidden = true;
}

function showHome() {
    hideAllPages();
    document.getElementById("homePage").hidden = false;
}

function openPage(pageId) {
    hideAllPages();
    document.getElementById(pageId).hidden = false;
}


// MEDICINE BUTTON

document.getElementById("medicineBtn").addEventListener("click", function() {
    openPage("medicinePage");
    displayItems("medicine", "medicineList");
});


// VACCINE BUTTON

document.getElementById("vaccineBtn").addEventListener("click", function() {
    openPage("vaccinePage");
    displayItems("vaccine", "vaccineList");
});


// ADD / UPDATE BUTTON

document.getElementById("updateBtn").addEventListener("click", function() {
    openPage("updatePage");
    displayInventoryTable();
});


// DISPLAY MEDICINES OR VACCINES

function displayItems(type, containerId) {
    const container = document.getElementById(containerId);

    const items = inventory.filter(item => item.type === type);

    if (items.length === 0) {
        container.innerHTML = "<p>No items added yet.</p>";
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="item-card">

            <h3>${escapeHTML(item.name)}</h3>

            <span class="status ${item.status}">
                ${item.status === "available"
                    ? "Available"
                    : "Not Available"}
            </span>

        </div>
    `).join("");
}


// ADD OR UPDATE INVENTORY

document.getElementById("inventoryForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("itemName").value.trim();
    const type = document.getElementById("itemType").value;
    const status = document.getElementById("itemStatus").value;

    if (!name || !type || !status) {
        alert("Please fill all details.");
        return;
    }

    const existingItem = inventory.find(item =>
        item.name.toLowerCase() === name.toLowerCase() &&
        item.type === type
    );

    if (existingItem) {
        existingItem.status = status;

        document.getElementById("message").textContent =
            "Item updated successfully!";
    } else {
        inventory.push({
            name: name,
            type: type,
            status: status
        });

        document.getElementById("message").textContent =
            "New item added successfully!";
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));

    displayInventoryTable();

    this.reset();
});


// DISPLAY INVENTORY TABLE

function displayInventoryTable() {
    const table = document.getElementById("inventoryTable");

    if (inventory.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="3">No inventory added yet.</td>
            </tr>
        `;
        return;
    }

    table.innerHTML = inventory.map(item => `
        <tr>
            <td>${escapeHTML(item.name)}</td>

            <td>
                ${item.type === "medicine" ? "Medicine" : "Vaccine"}
            </td>

            <td>
                <span class="table-status ${item.status}">
                    ${item.status === "available"
                        ? "Available"
                        : "Not Available"}
                </span>
            </td>
        </tr>
    `).join("");
}


// PREVENT HTML INPUT INJECTION

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}


// INITIAL DISPLAY

showHome();
