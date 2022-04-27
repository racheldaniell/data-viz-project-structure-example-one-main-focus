// the JS that creates the map here
// then stick it inside a <div> in the html

  // Set up initial map center and zoom level
  const map = L.map('map', {
    center: [40.7968362004517, -73.95190469677475], // EDIT latitude, longitude to re-center map
    zoom: 17,  // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
    scrollWheelZoom: true,
    tap: false
  });

  /* Control panel to display map layers */
  let controlLayers = L.control.layers( null, null, null, null, {
    position: "topright",
    collapsed: true
  }).addTo(map);

  // display Carto basemap tiles with light features and labels
  const light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
  }); // EDIT - insert or remove ".addTo(map)" before last semicolon to display by default
  controlLayers.addBaseLayer(light, 'Carto Light basemap');

  /* Stamen colored terrain basemap tiles with labels */
  const terrain = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
  }).addTo(map); // EDIT - insert or remove ".addTo(map)" before last semicolon to display by default
  controlLayers.addBaseLayer(terrain, 'Stamen Terrain basemap');

  // see more basemap options at https://leaflet-extras.github.io/leaflet-providers/preview/

  // Read markers data from data.csv
  $.get('data/data.csv', function(csvString) {

    // Use PapaParse to convert string to array of objects
    const data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

    // For each row in data, create a marker and add it to the map
    // For each row, columns `Latitude`, `Longitude`, and `Title` are required
    // here we need to make an exception and use VAR because we are incorporating older syntax with our papa.parse 
    for (var i in data) {
      var row = data[i];
      var imagePopup = row.filepath

      let popupContent = "<p>"+"This squirrel right here was: "+row.Age+" and "+row.Title+"<p> <img src='"+imagePopup+"' width='150px'> </p>"+"</p>" ;

      let marker = L.marker([row.Latitude, row.Longitude], {
        opacity: 0.8, 
          // Custom icon
          icon: L.icon({
          iconUrl:  'icons/sq_holding_nut_200px.png',
          iconSize: [40, 60] })
      }).bindPopup(popupContent);

      marker.addTo(map);
    }

  });



