// 📍 MAP SCRIPT FILE

window.addEventListener('load', () => {
  const map = L.map('map').setView([0, 0], 2);

  // 🌍 Hybrid satellite map
  L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=xUcsi6iIPkHCJLUYldFO', {
    tileSize: 512,
    zoomOffset: -1,
    attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors'
  }).addTo(map);

  let pins = [];
  let userMarker;
  let customIconUrl = null;
  document.getElementById('iconUpload').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    customIconUrl = event.target.result;
    alert('Custom icon loaded!');
  };
  reader.readAsDataURL(file);
});


  // 📌 Pin icon (red)
  const pinIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  // 👤 User location icon (blue)
  const userIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });

  function drawPins() {
    pins.forEach(p => {
      if (!p.marker) {
      const icon = customIconUrl ? L.icon({
  iconUrl: customIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
}) : pinIcon;

p.marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
        p.marker.bindPopup(`<b>${p.name || 'Pin'}</b>`);
      }
    });
  }

  map.on('click', e => {
    const name = prompt('Name this location:');
    if (!name) return;
    const p = { lat: e.latlng.lat, lng: e.latlng.lng, name };
    pins.push(p);
    drawPins();
  });

  // 📍 Get current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      map.setView([lat, lng], 15);
      userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map).bindPopup('You are here');
    });

    navigator.geolocation.watchPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      if (userMarker) userMarker.setLatLng([lat, lng]);
    });
  } else {
    alert('Geolocation not supported');
  }

  // 💾 Save pins
  document.getElementById('saveBtn').addEventListener('click', () => {
    localStorage.setItem('mapPins', JSON.stringify(pins));
    alert('Pins saved');
  });

  // 🔁 Load pins
  document.getElementById('loadBtn').addEventListener('click', () => {
    const saved = localStorage.getItem('mapPins');
    if (saved) {
      pins = JSON.parse(saved);
      drawPins();
      alert('Pins loaded');
    } else {
      alert('No saved pins found');
    }
  });

  // 👀 Auto-load pins
  document.getElementById('loadBtn').click();
});
