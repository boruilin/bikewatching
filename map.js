// Set your Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoiYm9ydWlsaW4iLCJhIjoiY203ZWZoZjJxMGQ0ZDJqb2cxOGRidjBkZiJ9.dJZ4b-RZgJL0Ck0Zpky5EQ" // Replace with your actual token
// Initialize the map
const map = new mapboxgl.Map({
  container: 'map', // ID of the div where the map will render
  style: 'mapbox://styles/mapbox/streets-v12', // Map style
  center: [-71.09415, 42.36027], // Longitude, Latitude (Boston)
  zoom: 12,
  minZoom: 5,
  maxZoom: 18
});

// Wait for the map to load before adding data
map.on('load', () => {
  console.log("Map is loaded");

  // Define a common style for both bike layers
  const bikeLaneStyle = {
    'line-color': '#32D400',  // Bright green
    'line-width': 4,          // Thick lines
    'line-opacity': 0.6       // Slight transparency
  };

  // 🔵 Add Boston bike lanes
  map.addSource('boston_route', {
    type: 'geojson',
    data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson'
  });

  map.addLayer({
    id: 'bike-lanes-boston',
    type: 'line',
    source: 'boston_route',
    paint: bikeLaneStyle
  });

  // 🟠 Add Cambridge bike lanes
  map.addSource('cambridge_route', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/cambridgegis/cambridgegis_data/main/Recreation/Bike_Facilities/RECREATION_BikeFacilities.geojson' // Replace with actual Cambridge data source
  });

  map.addLayer({
    id: 'bike-lanes-cambridge',
    type: 'line',
    source: 'cambridge_route',
    paint: bikeLaneStyle
  });

  console.log("Boston & Cambridge bike lanes added");


// ✅ Step 3.3: Initialize an empty stations array before fetching data
const svg = d3.select("#map").select("svg");

let stations = []; // ✅ Initialize an empty array to prevent errors

// ✅ Fetch Bluebikes station data
const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';

d3.json(jsonurl).then(jsonData => {
    console.log('Loaded JSON Data:', jsonData);

    // ✅ Update the stations array with actual data
    stations = jsonData.data.stations;
    console.log('Stations Array:', stations);

    // ✅ Helper function: Convert lat/lon to screen coordinates
    function getCoords(station) {
        const point = new mapboxgl.LngLat(+station.lon, +station.lat);  // ✅ Use correct field names
        const { x, y } = map.project(point);  
        return { cx: x, cy: y };
    }

    // ✅ Append circles for each station
    const circles = svg.selectAll('circle')
      .data(stations) // ✅ Ensure we're using the updated stations array
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', 'steelblue')
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .attr('opacity', 0.8)
      .attr('cx', d => getCoords(d).cx)
      .attr('cy', d => getCoords(d).cy)
      .on('mouseover', (event, d) => {
        d3.select("#tooltip")
          .style("visibility", "visible")
          .html(`<strong>${d.NAME}</strong><br>${d.Municipality}<br>Docks: ${d["Total Docks"]}`)
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 30 + "px");
      })
      .on('mouseout', () => {
        d3.select("#tooltip").style("visibility", "hidden");
      });

    // ✅ Function to update station positions on map move/zoom
    function updatePositions() {
        circles
          .attr('cx', d => getCoords(d).cx)
          .attr('cy', d => getCoords(d).cy);
    }

    // ✅ Ensure markers appear correctly after first load
    updatePositions();

    // ✅ Attach event listeners to update positions dynamically
    map.on('move', updatePositions);
    map.on('zoom', updatePositions);
    map.on('resize', updatePositions);
    map.on('moveend', updatePositions);

}).catch(error => console.error("Error loading Bluebikes data:", error));

});