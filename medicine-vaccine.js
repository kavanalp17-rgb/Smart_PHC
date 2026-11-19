
const STORAGE_KEY = "smartPHCInventory";

function loadInventory() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        console.error("Unable to load inventory:", error);
        return [];
    }
}

let inventory = loadInventory();

function hideAllPages() {
    document.getElementById("homePage").hidden = true;
    document.getElementById("medicinePage").hidden = true;
    document.getElementById("vaccinePage").hidden = true;
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

function displayItems(type, containerId) {
    const container = document.getElementById(containerId);

    const items = inventory.filter(item => item.type === type);

    if (items.length === 0) {
        container.innerHTML = "<p>No items available.</p>";
        return;
    }

    container.innerHTML = items.map(item => {
        const status = item.status === "unavailable"
            ? "unavailable"
            : "available";

        return `
            <div class="item-card">
                <h3>${escapeHTML(item.name)}</h3>
                <span class="status ${status}">
                    ${status === "available" ? "Available" : "Not Available"}
                </span>
            </div>
        `;
    }).join("");
}

// Automatically refresh when staff updates inventory in another tab
window.addEventListener("storage", function(event) {
    if (event.key === STORAGE_KEY) {
        inventory = loadInventory();

        if (!document.getElementById("medicinePage").hidden) {
            displayItems("medicine", "medicineList");
        }

        if (!document.getElementById("vaccinePage").hidden) {
            displayItems("vaccine", "vaccineList");
        }
    }
});

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
