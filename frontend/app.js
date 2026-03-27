// State Management
let currentUser = null;
let places = [];

// DOM Elements will be initialized in DOMContentLoaded
let authModal, authTitle, authForm, nameField, loginBtn, registerBtn, logoutBtn, userNav, guestNav, placesGrid, searchInput, categoryFilter, addPlaceForm, editPlaceForm, searchBtn;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize DOM Elements
    authModal = document.getElementById('authModal');
    authTitle = document.getElementById('authTitle');
    authForm = document.getElementById('authForm');
    nameField = document.getElementById('nameField');
    loginBtn = document.getElementById('loginBtn');
    registerBtn = document.getElementById('registerBtn');
    logoutBtn = document.getElementById('logoutBtn');
    userNav = document.getElementById('userNav');
    guestNav = document.getElementById('guestNav');
    placesGrid = document.getElementById('placesGrid');
    searchInput = document.getElementById('searchInput');
    categoryFilter = document.getElementById('categoryFilter');
    addPlaceForm = document.getElementById('addPlaceForm');
    editPlaceForm = document.getElementById('editPlaceForm');
    searchBtn = document.getElementById('searchBtn');

    console.log('DOM Content Loaded - Initializing Listeners');

    // 2. Setup listeners first so UI is interactive immediately
    setupEventListeners();
    
    // 3. Load dynamic data in background
    checkLoginStatus();
    loadPlaces();
});

// Setup Listeners
function setupEventListeners() {
    loginBtn?.addEventListener('click', () => openAuthModal('login'));
    registerBtn?.addEventListener('click', () => openAuthModal('register'));
    logoutBtn?.addEventListener('click', handleLogout);
    
    authForm?.addEventListener('submit', handleAuthSubmit);
    addPlaceForm?.addEventListener('submit', handleAddPlaceSubmit);
    editPlaceForm?.addEventListener('submit', handleEditPlaceSubmit);

    // Filter Listeners
    searchInput?.addEventListener('input', filterPlaces);
    categoryFilter?.addEventListener('change', filterPlaces);
    searchBtn?.addEventListener('click', filterPlaces);

    // Dynamic delegated for Explore buttons
    placesGrid?.addEventListener('click', (e) => {
        const btn = e.target.closest('.place-explore');
        if (btn) {
            const placeId = btn.dataset.id;
            if (placeId) {
                window.location.href = `place.html?id=${placeId}`;
            }
        }
    });

    // Close Modals on outside click
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    }
}

// Authentication Functions
async function checkLoginStatus() {
    try {
        const res = await fetch('/api/v1/auth/me');
        const data = await res.json();
        
        if (data.success) {
            currentUser = data.data;
            updateUIForAuth(true);
        } else {
            updateUIForAuth(false);
        }
    } catch (err) {
        updateUIForAuth(false);
    }
}

function openAuthModal(mode) {
    console.log('Opening Auth Modal:', mode);
    if (typeof openModal === 'function') {
        openModal('authModal');
    } else {
        // Fallback for different modal systems
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('active');
        }
    }
    
    if (authTitle) authTitle.textContent = mode === 'login' ? 'Welcome Back' : 'Join the Adventure';
    if (nameField) nameField.style.display = mode === 'login' ? 'none' : 'block';
    if (authForm) authForm.dataset.mode = mode;
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    const mode = authForm.dataset.mode;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name')?.value;

    const body = mode === 'login' ? { email, password } : { name, email, password };
    const url = `/api/v1/auth/${mode}`;

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        
        if (data.success) {
            // Save Real JWT Token for shared usage across pages
            if(data.token) {
                localStorage.setItem('token', data.token);
            }
            location.reload();
        } else {
            alert(data.error || 'Something went wrong');
        }
    } catch (err) {
        alert('Internal server error');
    }
}

async function handleLogout() {
    try {
        await fetch('/api/v1/auth/logout');
        location.reload();
    } catch (err) {
        console.error('Logout failed');
    }
}

function updateUIForAuth(isLoggedIn) {
    if (isLoggedIn) {
        if(guestNav) guestNav.style.display = 'none';
        if(userNav) userNav.style.display = 'flex';
        const display = document.getElementById('userNameDisplay');
        if(display) display.textContent = currentUser.name.charAt(0).toUpperCase();
        
        // Persist for article.js and other pages
        localStorage.setItem('userRole', currentUser.role);
        // Only set 'token' if it doesn't already have one (from login)
        if (!localStorage.getItem('token')) {
            localStorage.setItem('token', 'exists'); // Marker for UI
        }

        const adminCtrl = document.getElementById('adminControls');
        if (currentUser.role === 'admin' && adminCtrl) {
            adminCtrl.style.display = 'block';
        }
    } else {
        if(guestNav) guestNav.style.display = 'flex';
        if(userNav) userNav.style.display = 'none';
        localStorage.removeItem('userRole');
        localStorage.removeItem('token');
    }
}

// Places Functions
async function loadPlaces() {
    try {
        const res = await fetch('/api/v1/places');
        const data = await res.json();
        if (data.success) {
            places = data.data;
            
            // Check for category filter in URL
            const params = new URLSearchParams(window.location.search);
            const catParam = params.get('category');
            if (catParam && categoryFilter) {
                categoryFilter.value = catParam;
                filterPlaces();
            } else {
                renderPlaces(places);
            }
        }
    } catch (err) {
        console.error('Failed to load places');
    }
}

const FALLBACK_IMAGES = {
    Religious:  'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?q=80&w=1200&auto=format&fit=crop',
    Heritage:   'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop',
    Nature:     'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=1200&auto=format&fit=crop',
    Others:     'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
};

function renderPlaces(dataToRender) {
    if (!placesGrid) return;

    if (dataToRender.length === 0) {
        placesGrid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:120px 0;border:2px dashed rgba(255,255,255,0.06);border-radius:28px;">
                <div style="font-size:3rem;margin-bottom:16px;">🏛️</div>
                <p style="color:rgba(255,255,255,0.2);font-size:1.2rem;font-weight:700;letter-spacing:-0.5px;">No destinations found.</p>
                <p style="color:rgba(255,255,255,0.1);font-size:0.82rem;margin-top:8px;">Try a different search or category.</p>
            </div>
        `;
        return;
    }

    const starsHTML = (rating) => {
        if (!rating) return '<span style="color:rgba(255,255,255,0.2);font-size:0.75rem;font-weight:700;">UNRATED</span>';
        const full = Math.round(rating);
        return `<span style="color:var(--gold);font-weight:800;font-size:0.9rem;">★ ${rating.toFixed ? rating.toFixed(1) : rating}</span>`;
    };

    placesGrid.innerHTML = dataToRender.map(place => {
        // Find best image or fallback
        let imgSrc = (place.images && place.images[0] && !['no-photo.jpg',''].includes(place.images[0]))
            ? place.images[0]
            : (FALLBACK_IMAGES[place.category] || FALLBACK_IMAGES.Others);
            
        return `
        <div class="place-card" style="animation: fadeInUp 0.6s ease both;">
            <div class="place-img">
                <img src="${imgSrc}" alt="${place.name}" loading="lazy"
                    onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop';">
                <div class="place-img-overlay"></div>
                <div class="place-category">${place.category}</div>
            </div>
            <div class="place-card-body">
                <div class="place-location">
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
                    ${place.location}
                </div>
                <div class="place-name">${place.name}</div>
                <p class="place-desc">${place.description}</p>
                <div class="place-footer">
                    <div class="place-rating">${starsHTML(place.averageRating)}</div>
                    <div style="display:flex; gap:8px; align-items:center;">
                        ${currentUser && currentUser.role === 'admin' ? `
                            <a href="edit-place.html?id=${place._id}" class="btn-admin-action" title="Edit Place">✏️</a>
                            <button class="btn-admin-action" onclick="deletePlace('${place._id}')" title="Delete">🗑️</button>
                        ` : ''}
                        <a href="place.html?id=${place._id}" class="place-explore" style="text-decoration:none; padding: 6px 12px; border: 1px solid var(--border); border-radius: 99px; transition: all 0.3s; background: var(--cream);">
                            Explore
                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

function filterPlaces() {
    const query = searchInput.value.toLowerCase();
    const cat = categoryFilter.value;
    
    const filtered = places.filter(place => {
        const matchesSearch = place.name.toLowerCase().includes(query) || place.location.toLowerCase().includes(query);
        const matchesCat = cat === 'all' || place.category.toLowerCase() === cat.toLowerCase();
        return matchesSearch && matchesCat;
    });
    
    renderPlaces(filtered);
}

// Admin API
// deletePlace remains for quick removal directly from the list

async function deletePlace(id) {
    if (!confirm('Are you sure you want to delete this place?')) return;
    try {
        const res = await fetch(`/api/v1/places/${id}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        if (data.success) {
            location.reload();
        } else {
            alert(data.error || 'Failed to delete place');
        }
    } catch (err) {
        alert('Server error');
    }
}

// Utility UI
function toggleModal(id) {
    const modal = document.getElementById(id);
    modal.classList.toggle('active');
}

function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'flex';
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}

// Close modal on outside click
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal-overlay').forEach(el => {
        el.addEventListener('click', function (e) {
            if (e.target === this) this.style.display = 'none';
        });
    });

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.f-card').forEach(el => {
        el.classList.add('anim-up');
        observer.observe(el);
    });
});
