
const STORAGE_KEY = "smartPHCInventory";

function displayInventory() {
    let inventory = [];

    try {
        inventory = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
        console.error("Error loading inventory:", error);
    }

    displayItems(inventory, "medicine", "medicineList");
    displayItems(inventory, "vaccine", "vaccineList");
}

function displayItems(inventory, type, containerId) {
    const container = document.getElementById(containerId);

    const items = inventory.filter(item => item.type === type);

    if (items.length === 0) {
        container.innerHTML = "<p>No items available.</p>";
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="medicine-card">
            <h3>${escapeHTML(item.name)}</h3>
            <span class="stock ${
                item.status === "available" ? "available" : "unavailable"
            }">
                ${item.status === "available" ? "Available" : "Not Available"}
            </span>
        </div>
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

displayInventory();

window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEY) {
        displayInventory();
    }
});
