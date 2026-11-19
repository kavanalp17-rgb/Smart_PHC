
const STORAGE_KEY = "smartPHCInventory";

const defaultInventory = [
    { name: "Paracetamol", type: "medicine", status: "available" },
    { name: "Amoxicillin", type: "medicine", status: "available" },
    { name: "Vitamin C", type: "medicine", status: "unavailable" },
    { name: "Cetirizine", type: "medicine", status: "available" },
    { name: "ORS", type: "medicine", status: "unavailable" },

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
            return saved.map(item => ({
                name: item.name,
                type: item.type,
                status: item.status === "unavailable"
                    ? "unavailable"
                    : "available"
            }));
        }
    } catch (error) {
        console.error("Could not load inventory:", error);
    }

    return defaultInventory.map(item => ({ ...item }));
}

let inventory = loadInventory();

function saveInventory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}

if (!localStorage.getItem(STORAGE_KEY)) {
    saveInventory();
}

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

document.getElementById("medicineBtn").addEventListener("click", function () {
    inventory = loadInventory();
    openPage("medicinePage");
    displayItems("medicine", "medicineList");
});

document.getElementById("vaccineBtn").addEventListener("click", function () {
    inventory = loadInventory();
    openPage("vaccinePage");
    displayItems("vaccine", "vaccineList");
});

document.getElementById("updateBtn").addEventListener("click", function () {
    inventory = loadInventory();
    openPage("updatePage");
    displayInventoryTable();
});

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
                ${item.status === "available" ? "Available" : "Not Available"}
            </span>
        </div>
    `).join("");
}

document.getElementById("inventoryForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("itemName").value.trim();
    const type = document.getElementById("itemType").value;
    const status = document.getElementById("itemStatus").value;

    if (!name || !type || !status) {
        alert("Please enter valid inventory details.");
        return;
    }

    inventory = loadInventory();

    const existingItem = inventory.find(item =>
        item.name.toLowerCase() === name.toLowerCase() &&
        item.type === type
    );

    if (existingItem) {
        existingItem.name = name;
        existingItem.status = status;

        document.getElementById("message").textContent =
            "Inventory updated successfully!";
    } else {
        inventory.push({
            name,
            type,
            status
        });

        document.getElementById("message").textContent =
            "New inventory item added successfully!";
    }

    saveInventory();
    displayInventoryTable();
    this.reset();
});

function displayInventoryTable() {
    const table = document.getElementById("inventoryTable");

    if (inventory.length === 0) {
        table.innerHTML = `
            <tr><td colspan="3">No inventory added yet.</td></tr>
        `;
        return;
    }

    table.innerHTML = inventory.map(item => `
        <tr>
            <td>${escapeHTML(item.name)}</td>
            <td>${item.type === "medicine" ? "Medicine" : "Vaccine"}</td>
            <td>
                <span class="table-status ${item.status}">
                    ${item.status === "available" ? "Available" : "Not Available"}
                </span>
            </td>
        </tr>
    `).join("");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

showHome();
