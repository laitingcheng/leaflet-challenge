// Create a variable for earthquake data url
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Create a new Leaflet map 
let myMap = L.map("map", {
  center: [37.6000, -95.6650],
  zoom: 3.5 });

// Add a tile layer to our map
let layer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
}).addTo(myMap);

// Create a new layer group for the earthquake data
let earthquakes = L.layerGroup().addTo(myMap);
// Create a function to loop through GeoJSON data and create markers for each earthquake data
d3.json(queryUrl).then(function(data) {
  L.geoJSON(data,{pointToLayer: function(feature, latlng){
      return L.circleMarker(latlng,{
        radius: feature.properties.mag * 5,
        fillColor: getColorDepth(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 1});},
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
        "</h3><hr><p>" + "Magnitude: " + feature.properties.mag + "</p>" +
        "</h3><hr><p>" + "Depth: " + feature.geometry.coordinates[2] + "</p>");}
  }).addTo(earthquakes);
  // Define a function - color for depth of earthquakes.
  function getColorDepth(depth) {
    if (depth > 90) {
      return "#FF0000";
    } else if (depth > 70) {
      return "#FF3300 ";
    } else if (depth > 50) {
      return "#ff9900";
    } else if (depth > 30) {
      return "#FFFF00";
    } else if (depth > 10) {
      return "#99ff00";
    } else {
      return "#00FF00";}}
  // Create legend for earthquakes depth/colors
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    div.style.backgroundColor = "white"; // Set the background color
    div.style.color = "black"; // Set the text color
    div.style.padding = "5px"; // Add spacing between text and background
    let depthMeasures = [-10, 10, 30, 50, 70, 90];
    let labels = [];
        for (let i = 0; i < depthMeasures.length; i++) {
            div.innerHTML +=
              '<i style="background:' + getColorDepth(depthMeasures[i] + 1) + '"></i> ' +
              depthMeasures[i] + (depthMeasures[i + 1] ? '&ndash;' + depthMeasures[i + 1] + '<br>' : '+');}
          return div;};
        // Add legend
        legend.addTo(myMap);});

