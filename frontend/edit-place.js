// Edit Place - External Script
document.addEventListener('DOMContentLoaded', function () {
    var pid = new URLSearchParams(location.search).get('id');
    if (!pid) { alert('No destination ID found.'); return; }

    // Load existing place data
    fetch('/api/v1/places/' + pid)
        .then(function (r) { return r.json(); })
        .then(function (d) {
            if (d.success) {
                var p = d.data;
                document.getElementById('editPlaceId').value = p._id;
                document.getElementById('editPlaceName').value = p.name;
                document.getElementById('editPlaceLocation').value = p.location;
                document.getElementById('editPlaceCategory').value = p.category;
                document.getElementById('editPlaceDescription').value = p.description;
                document.getElementById('editPlaceMap').value = p.mapUrl || '';
                var img = (p.images && p.images.length > 0 && p.images[0] !== 'no-photo.jpg') ? p.images.join(', ') : '';
                document.getElementById('editPlaceImage').value = img;
            } else {
                alert('Could not load destination data.');
            }
        })
        .catch(function () { alert('Server error loading data.'); });

    // Update form submit
    var form = document.getElementById('standaloneEditForm');
    form && form.addEventListener('submit', async function (e) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Saving...';
        btn.disabled = true;

        var id = document.getElementById('editPlaceId').value;
        var imgVal = document.getElementById('editPlaceImage').value.trim();
        var mapVal = document.getElementById('editPlaceMap').value.trim();
        var d = {
            name: document.getElementById('editPlaceName').value,
            location: document.getElementById('editPlaceLocation').value,
            category: document.getElementById('editPlaceCategory').value,
            description: document.getElementById('editPlaceDescription').value,
            mapUrl: mapVal,
            images: imgVal ? imgVal.split(',').map(i => i.trim()) : ['no-photo.jpg']
        };

        try {
            var r = await fetch('/api/v1/places/' + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(d)
            });
            var j = await r.json();
            if (j.success) {
                alert('✅ Updated successfully!');
                location.href = 'place.html?id=' + id;
            } else {
                alert('❌ ' + (j.error || 'Update failed.'));
                btn.textContent = 'Update Destination';
                btn.disabled = false;
            }
        } catch (err) {
            alert('Server error. Please try again.');
            btn.textContent = 'Update Destination';
            btn.disabled = false;
        }
    });

    // Delete button
    var delBtn = document.getElementById('deleteBtnAction');
    delBtn && delBtn.addEventListener('click', async function () {
        var id = document.getElementById('editPlaceId').value;
        var name = document.getElementById('editPlaceName').value;
        if (!confirm('Permanently delete "' + name + '"?\n\nThis cannot be undone.')) return;
        try {
            var r = await fetch('/api/v1/places/' + id, { method: 'DELETE' });
            var j = await r.json();
            if (j.success) {
                alert('✅ "' + name + '" deleted successfully.');
                location.href = 'index.html';
            } else {
                alert('❌ ' + (j.error || 'Delete failed.'));
            }
        } catch (err) {
            alert('Server error. Please try again.');
        }
    });
});
