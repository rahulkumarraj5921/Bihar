document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    const loader = document.getElementById('loader');
    const articleView = document.getElementById('articleView');
    const displayTitle = document.getElementById('displayTitle');
    const displayContent = document.getElementById('displayContent');
    const adminEditBar = document.getElementById('adminEditBar');

    if (!slug) {
        window.location.href = 'index.html';
        return;
    }

    // Show Admin Bar if appropriate
    if (token && role === 'admin') {
        adminEditBar.style.display = 'flex';
    }

    // Load Article
    fetchArticle();

    async function fetchArticle() {
        try {
            const res = await fetch(`/api/v1/articles/${slug}`);
            const data = await res.json();

            loader.style.display = 'none';
            articleView.style.display = 'block';

            if (data.success) {
                const art = data.data;
                displayTitle.innerText = art.title;
                displayContent.innerHTML = art.content; 
                
                // Show Banner Image
                const hero = document.querySelector('.hero-mini');
                if (hero) {
                    hero.style.backgroundImage = art.image 
                        ? `url('${art.image}')` 
                        : `url('images/heritage_banner.png')`;
                }

                // Store for editing
                document.getElementById('editTitle').value = art.title;
                document.getElementById('editImage').value = art.image || '';
                document.getElementById('editContent').value = art.content;
            } else {
                // Not found or empty - setup for creation
                displayTitle.innerText = decodeURIComponent(slug.replace(/-/g, ' ')).toUpperCase();
                displayContent.innerHTML = '<p style="color: #968875;">No information has been added yet for this page.</p>';
                if (role === 'admin') {
                    displayContent.innerHTML += '<p style="margin-top:20px;"><button class="btn-edit" onclick="openEditor()" style="display:inline-block;">+ Add Information Now</button></p>';
                }
                document.getElementById('editTitle').value = displayTitle.innerText;
                document.getElementById('editImage').value = "";
                document.getElementById('editContent').value = "";
            }
        } catch (err) {
            console.error('Fetch error:', err);
            loader.innerText = 'Unable to load content. Please try again later.';
        }
    }

    // Editor Logic
    window.openEditor = () => {
        document.getElementById('editorModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    window.closeEditor = () => {
        document.getElementById('editorModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    window.deleteArticle = async () => {
        if (!confirm('Are you sure you want to delete this page permanently?')) return;
        try {
            const res = await fetch(`/api/v1/articles/${slug}`, {
                method: 'DELETE',
                headers: getAuthHeaders(false)
            });
            const data = await res.json();
            if (data.success) {
                alert('Page deleted.');
                window.location.href = 'index.html';
            } else {
                alert('Delete failed');
            }
        } catch (err) {
            alert('Error deleting page.');
        }
    };

    // Helper to get headers
    function getAuthHeaders(includeJson = true) {
        const h = {};
        if (includeJson) h['Content-Type'] = 'application/json';
        const t = localStorage.getItem('token');
        if (t && t !== 'exists') {
            h['Authorization'] = `Bearer ${t}`;
        }
        return h;
    }

    // Form Submission
    const articleForm = document.getElementById('articleForm');
    articleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.innerText = 'Saving...';
        saveBtn.disabled = true;

        const title = document.getElementById('editTitle').value;
        const image = document.getElementById('editImage').value;
        const content = document.getElementById('editContent').value;

        try {
            const res = await fetch('/api/v1/articles', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ slug, title, content, image })
            });

            const data = await res.json();
            if (data.success) {
                alert('Page updated successfully!');
                location.reload();
            } else {
                alert(`Error: ${data.error || 'Something went wrong'}`);
                saveBtn.innerText = 'Save Changes';
                saveBtn.disabled = false;
            }
        } catch (err) {
            console.error('Save error:', err);
            alert('Failed to save changes. Network error.');
            saveBtn.innerText = 'Save Changes';
            saveBtn.disabled = false;
        }
    });

    // Close modal on click outside
    document.getElementById('editorModal').addEventListener('click', (e) => {
        if (e.target.id === 'editorModal') closeEditor();
    });
});
