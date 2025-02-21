// Set your Mapbox access token
mapboxgl.accessToken = pk.eyJ1IjoiYm9ydWlsaW4iLCJhIjoiY203ZWZoZjJxMGQ0ZDJqb2cxOGRidjBkZiJ9.dJZ4b-RZgJL0Ck0Zpky5EQ; // Replace with your actual token

// Initialize the map
const map = new mapboxgl.Map({
  container: 'map', // ID of the div where the map will render
  style: 'mapbox://styles/mapbox/streets-v12', // Map style
  center: [-71.09415, 42.36027], // [longitude, latitude] (example: Boston, MA)
  zoom: 12, // Initial zoom level
  minZoom: 5, // Minimum allowed zoom
  maxZoom: 18 // Maximum allowed zoom
});

// Add zoom and rotation controls to the map
map.addControl(new mapboxgl.NavigationControl());

// Add a marker at the center
new mapboxgl.Marker()
  .setLngLat([-71.09415, 42.36027]) // Example location
  .setPopup(new mapboxgl.Popup().setHTML("<h3>Bike Spot</h3><p>Great for bikewatching!</p>"))
  .addTo(map);
