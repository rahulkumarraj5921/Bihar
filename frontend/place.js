// Bihar Tourism - Place Detail Page (with Admin Controls)
const FALLBACKS = {
    Religious: '/images/mahabodhi.png',
    Heritage: '/assets/images/nalanda.png',
    Nature: '/assets/images/rajgir.png',
    Other: '/assets/images/mahabodhi.png'
};

let currentUser = null;

async function init() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) { renderError('No destination ID found in URL.'); return; }

    // Load user session & place data in parallel
    try {
        const [authRes, placeRes] = await Promise.all([
            fetch('/api/v1/auth/me'),
            fetch('/api/v1/places/' + id)
        ]);

        const authData = await authRes.json();
        if (authData.success) currentUser = authData.data;

        const placeData = await placeRes.json();
        if (placeData.success && placeData.data) {
            renderPlace(placeData.data);
        } else {
            renderError(placeData.error || 'Destination not found.');
        }
    } catch (err) {
        console.error('Error:', err);
        renderError('Could not connect to the server. Please refresh and try again.');
    }
}

function renderPlace(p) {
    const img = (p.images && p.images[0] && !['no-photo.jpg', ''].includes(p.images[0]))
        ? p.images[0]
        : (FALLBACKS[p.category] || FALLBACKS.Other);

    document.title = p.name + ' | Bihar Tourism';

    const stars = p.averageRating ? '★ ' + Number(p.averageRating).toFixed(1) : 'New';
    const isAdmin = currentUser && currentUser.role === 'admin';

    const categoryIcons = {
        Religious: '🙏', Heritage: '🏛️', Nature: '🌿', Others: '✨'
    };
    const icon = categoryIcons[p.category] || '📍';

    // Build info chips
    const chips = [
        { label: 'Category', value: p.category, icon: icon },
        { label: 'Location', value: p.location, icon: '📍' },
        { label: 'Rating', value: stars, icon: '' },
    ].map(c => `
        <div class="info-chip">
            <div class="chip-label">${c.label}</div>
            <div class="chip-value">${c.icon ? c.icon + ' ' : ''}${c.value}</div>
        </div>
    `).join('');

    // Admin buttons
    const adminBar = isAdmin ? `
        <div class="admin-bar">
            <span class="admin-label">⚙️ Admin Controls</span>
            <div class="admin-actions">
                <a href="edit-place.html?id=${p._id}" class="btn-edit">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    Edit Destination
                </a>
                <button class="btn-delete" onclick="handleDelete('${p._id}', '${p.name.replace(/'/g, "\\'")}')">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    Delete
                </button>
            </div>
        </div>
    ` : '';

    document.getElementById('app').innerHTML = `
        <div class="hero" style="background-image:url('${img}')">
            <div class="hero-overlay"></div>
            <div class="hero-badge">${icon} ${p.category}</div>
        </div>

        <div class="container">
            <div class="card animate">
                ${adminBar}
                <div class="card-header">
                    <div class="location-tag">
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
                        ${p.location}
                    </div>
                    <h1 class="title">${p.name}</h1>
                </div>

                <div class="info-chips">${chips}</div>

                <div class="section">
                    <div class="section-label">About This Place</div>
                    <p class="description">${p.description}</p>
                </div>

                ${p.images && p.images.length > 0 ? `
                <div class="section">
                    <div class="section-label">Figures & Gallery</div>
                    <div class="gallery">
                        ${p.images.map(im => `<img src="${im}" alt="${p.name}" class="gallery-img" onclick="window.open(this.src,'_blank')">`).join('')}
                    </div>
                </div>` : ''}

                ${p.mapUrl ? `
                <div class="section">
                    <div class="section-label">Location on Map</div>
                    <div style="width:100%; height:400px; border-radius:24px; overflow:hidden; border:1px solid var(--border);">
                        <iframe src="${p.mapUrl}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                    </div>
                </div>` : ''}

                <div class="bottom-row">
                    <a href="index.html" class="back-link">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
                        All Destinations
                    </a>
                    ${isAdmin ? `<a href="add-place.html" class="btn-add">+ Add New Destination</a>` : ''}
                </div>
            </div>
        </div>
    `;
}

async function handleDelete(id, name) {
    if (!confirm('Delete "' + name + '"?\n\nThis action cannot be undone.')) return;

    try {
        const res = await fetch('/api/v1/places/' + id, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            alert('"' + name + '" has been deleted successfully.');
            window.location.href = 'index.html';
        } else {
            alert('Delete failed: ' + (data.error || 'Unknown error'));
        }
    } catch (err) {
        alert('Server error. Please try again.');
    }
}

function renderError(msg) {
    document.getElementById('app').innerHTML = `
        <div class="error-state">
            <div class="err-icon">🏛️</div>
            <h2 class="err-title">Destination Not Found</h2>
            <p class="err-msg">${msg}</p>
            <a href="index.html" class="err-btn">← Back to Home</a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', init);
