// Add Place - External Script
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('standaloneAddForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Publishing...';
        btn.disabled = true;

        var imgVal = document.getElementById('placeImage').value.trim();
        var mapVal = document.getElementById('placeMap').value.trim();
        var d = {
            name: document.getElementById('placeName').value,
            location: document.getElementById('placeLocation').value,
            category: document.getElementById('placeCategory').value,
            description: document.getElementById('placeDescription').value,
            mapUrl: mapVal,
            images: imgVal ? imgVal.split(',').map(i => i.trim()) : ['no-photo.jpg']
        };

        try {
            var r = await fetch('/api/v1/places', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(d)
            });
            var j = await r.json();
            if (j.success) {
                alert('✅ Destination "' + d.name + '" added successfully!');
                location.href = 'index.html';
            } else {
                alert('❌ ' + (j.error || 'Failed. Make sure you are logged in as admin.'));
                btn.textContent = 'Publish Destination';
                btn.disabled = false;
            }
        } catch (err) {
            alert('Server error. Please try again.');
            btn.textContent = 'Publish Destination';
            btn.disabled = false;
        }
    });
});
