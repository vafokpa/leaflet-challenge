// Storing url in variable
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson";

// Getting the data 
d3.json(url, function(data){
    // Once we get the Response, send the data.features object to the createFeatures function 
    createFeatures(data.features);
});

//  Creating a function for the different colors 

function getColor(mag) {
    if (mag > 5) return "#ff0000";
    if (mag > 4) return "#ff8080";
    if (mag > 3) return "#ff9300";
    if (mag > 2) return "#ffbf66";
    if (mag > 1) return "#00e600";
    else return "#99ff99";
  };



// Creating the pop-ups and their features 
function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place + "<h3> Magnitude: " + feature.properties.mag + "</h3>"+
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(feature,latlng) {
          return new L.CircleMarker(latlng, {
              radius: feature.properties.mag * 8,
              color: 'white',
              fillColor: getColor(feature.properties.mag),
              'weight': 1,
              fillOpacity: 0.8
          });
      },  
      onEachFeature: onEachFeature
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }


function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 10,
      id: "mapbox.light",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the earthquakes layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create the map object with options
    var map = L.map("map", {
      center: [39.8283, -98.5795],
      zoom: 3,
      layers: [lightmap, earthquakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

// here // 

      //   Addind a legend to my map 
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          maggie = [0,1,2,3,4,5],
          labels = [];
  
      // loop through our magnitude intervals and generate a label with a colored square for each interval
      for (var i = 0; i < maggie.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(maggie[i] + 0.1) + '"></i> ' +
              maggie[i] + (maggie[i + 1] ? '&ndash;' + maggie[i + 1] + '<br>' : '+');
              
      }
      return div;

  };
  legend.addTo(map); 


  }







