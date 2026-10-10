const catalogData = [
    { id: 1, name: "Cyberpunk 2077", type: "Game", desc: "Open-world action RPG set in Night City.", image: "images/cyberpunk2077.jpg" },
    { id: 2, name: "Elden Ring", type: "Game", desc: "Action RPG in the Lands Between.", image: "images/eldenring.webp" },
    { id: 3, name: "Lord of the Mysteries", type: "Novel", desc: "Steampunk fantasy webnovel with Cthulhu mythos.", image: "images/lotm.jpg" },
    { id: 4, name: "Solo Leveling", type: "Manhwa", desc: "Famous gate-dungeon hunter webtoon.", image: "images/solo leveling.jpg" },
    { id: 5, name: "The Omniscient Reader", type: "Manhwa", desc: "A reader survives an apocalyptic world of his favorite novel.", image: "images/orv.jpg" },
    { id: 6, name: "The Beginning After The End", type: "Novel", desc: "King Grey reincarnates into a magic-filled continent.", image: "images/tbate.jpg" }
];

let trackedItems = [];
let activeSelectedId = null;

const mediaGrid = document.getElementById('media-grid');
const trackerList = document.getElementById('tracker-list');
const trackerCounter = document.getElementById('tracker-counter');
const modal = document.getElementById('detail-modal');
const dynamicFormFields = document.getElementById('dynamic-form-fields');

function loadCatalog() {
    mediaGrid.innerHTML = ""; 
    
    catalogData.forEach(item => {
        const cardHtml = `
            <div class="media-card">
                <div class="img-container">
                    <span class="type-badge">${item.type}</span>
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="card-info">
                    <div>
                        <h3>${item.name}</h3>
                        <p>${item.desc}</p>
                    </div>
                    <button class="add-btn" onclick="openModal(${item.id})">Add to Tracker</button>
                </div>
            </div>
        `;
        mediaGrid.innerHTML += cardHtml;
    });
}

function openModal(itemId) {
    activeSelectedId = itemId;
    const existing = trackedItems.find(item => item.id === itemId);
    const catalogItem = catalogData.find(item => item.id === itemId);

    const mediaType = catalogItem.type;
    document.getElementById('modal-title').innerText = `Track: ${catalogItem.name}`;

    // Render type-specific form fields
    if (mediaType === "Game") {
        dynamicFormFields.innerHTML = `
            <div class="form-group">
                <label for="track-platform">Platform</label>
                <select id="track-platform">
                    <option value="PC">PC</option>
                    <option value="PlayStation">PlayStation</option>
                    <option value="Xbox">Xbox</option>
                    <option value="Nintendo Switch">Nintendo Switch</option>
                </select>
            </div>
            <div class="form-group">
                <label for="track-status">Status</label>
                <select id="track-status">
                    <option value="Playing">Playing</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Backlog">Backlog</option>
                </select>
            </div>
            <div class="form-group">
                <label for="track-playtime">Playtime (Hours)</label>
                <input type="number" id="track-playtime" placeholder="e.g. 45">
            </div>
        `;
    } else {
        dynamicFormFields.innerHTML = `
            <div class="form-group">
                <label for="track-status">Status</label>
                <select id="track-status">
                    <option value="Reading">Reading</option>
                    <option value="Completed">Completed</option>
                    <option value="Plan to Read">Plan to Read</option>
                    <option value="On Hold">On Hold</option>
                </select>
            </div>
            <div class="form-group">
                <label for="track-progress">Progress (e.g. Chapter 45, Vol 2)</label>
                <input type="text" id="track-progress" placeholder="e.g. Chapter 120">
            </div>
        `;
    }

    // Populate existing values if editing
    if (existing) {
        if (mediaType === "Game") {
            document.getElementById('track-platform').value = existing.platform || "PC";
            document.getElementById('track-status').value = existing.status || "Playing";
            document.getElementById('track-playtime').value = existing.playtime || "";
        } else {
            document.getElementById('track-status').value = existing.status || "Reading";
            document.getElementById('track-progress').value = existing.progress || "";
        }
        document.getElementById('track-rating').value = existing.rating || "";
        document.getElementById('track-notes').value = existing.notes || "";
    } else {
        document.getElementById('track-rating').value = "";
        document.getElementById('track-notes').value = "";
    }

    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
    activeSelectedId = null;
}

function saveItemDetails() {
    if (!activeSelectedId) return;

    const catalogItem = catalogData.find(element => element.id === activeSelectedId);
    const mediaType = catalogItem.type;

    const rating = document.getElementById('track-rating').value;
    const notes = document.getElementById('track-notes').value.trim();

    let itemDetails = {
        ...catalogItem,
        rating,
        notes
    };

    if (mediaType === "Game") {
        itemDetails.platform = document.getElementById('track-platform').value;
        itemDetails.status = document.getElementById('track-status').value;
        itemDetails.playtime = document.getElementById('track-playtime').value;
    } else {
        itemDetails.status = document.getElementById('track-status').value;
        itemDetails.progress = document.getElementById('track-progress').value.trim();
    }

    const existingIndex = trackedItems.findIndex(item => item.id === activeSelectedId);

    if (existingIndex > -1) {
        trackedItems[existingIndex] = itemDetails;
    } else {
        trackedItems.push(itemDetails);
    }

    closeModal();
    updateTrackerUI();
}

function deleteTrackedItem(itemId) {
    trackedItems = trackedItems.filter(item => item.id !== itemId);
    updateTrackerUI();
}

function updateTrackerUI() {
    trackerList.innerHTML = "";
    
    if (trackedItems.length === 0) {
        trackerList.innerHTML = `<li class="empty-state">No media archived yet. Click "Add to Tracker" to begin.</li>`;
        trackerCounter.innerText = "0 Items Logged";
        return;
    }

    trackerCounter.innerText = `${trackedItems.length} Item${trackedItems.length > 1 ? 's' : ''} Logged`;

    trackedItems.forEach(item => {
        const isGame = item.type === "Game";

        const detailsHtml = isGame ? `
            <span class="detail-badge">${item.platform || 'PC'}</span>
            <span class="detail-badge">${item.status || 'Tracked'}</span>
            ${item.playtime ? `<span>Playtime: <strong>${item.playtime} hrs</strong></span>` : ''}
            ${item.rating ? `<span>Rating: <strong>${item.rating}/10</strong></span>` : ''}
        ` : `
            <span class="detail-badge">${item.status || 'Tracked'}</span>
            ${item.progress ? `<span>Progress: <strong>${item.progress}</strong></span>` : ''}
            ${item.rating ? `<span>Rating: <strong>${item.rating}/10</strong></span>` : ''}
        `;

        const itemHtml = `
            <li class="tracker-item">
                <div class="tracker-item-header">
                    <span class="item-title">${item.name}</span>
                    <span class="item-type">${item.type}</span>
                </div>
                <div class="tracker-details">
                    ${detailsHtml}
                </div>
                ${item.notes ? `<div class="tracker-notes">"${item.notes}"</div>` : ''}
                <div class="action-btns">
                    <button class="icon-btn" onclick="openModal(${item.id})">Edit</button>
                    <button class="icon-btn delete" onclick="deleteTrackedItem(${item.id})">Delete</button>
                </div>
            </li>
        `;
        trackerList.innerHTML += itemHtml;
    });
}

document.addEventListener('DOMContentLoaded', loadCatalog);