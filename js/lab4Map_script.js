// river data from here: https://catalog.data.gov/dataset/national-wild-and-scenic-river-active-study-rivers-lines-feature-layer-3d86c
// recreation opportunities from herer: https://catalog.data.gov/dataset/recreation-opportunities-feature-layer-69fe2

// get some info on the structure of the file
fetch('data/Recreation_Opportunities.geojson')
    .then(response => response.json())
    .then(data => {
        // Initialize summary object
        const summary = {
            totalFeatures: data.features.length,
            properties: {}
        };

        // Iterate through each feature
        data.features.forEach(feature => {
            // Extract properties of each feature
            const properties = feature.properties;

            // Iterate through each property
            for (const [key, value] of Object.entries(properties)) {
                // Initialize property in summary object if not already present
                if (!summary.properties[key]) {
                    summary.properties[key] = {
                        count: 1,
                        values: [value]
                    };
                } else {
                    // Update count and values array for the property
                    summary.properties[key].count++;
                    summary.properties[key].values.push(value);
                }
            }
        });

        // Print summary to console
        console.log('Summary:', summary);
    })
    .catch(error => console.error('Error fetching or parsing GeoJSON:', error));

// make the map
// this is the mapping object in memory
var map = L.map('map').setView([44, -120], 7);

// hyperlinks from mapbox for style
// style url: mapbox://styles/warnekeb/clswrfll8002e01py3vvoerv4
// access token: pk.eyJ1Ijoid2FybmVrZWIiLCJhIjoiY2xzb3plZzh4MDAwdzJqczNjYnJxY3Y3dyJ9.KAtMBP36gpid7pf25U1BXQ
// template: https://api.mapbox.com/styles/v1/YOUR_USERNAME/YOUR_STYLE_ID/tiles/256/{z}/{x}/{y}?access_token=YOUR_MAPBOX_ACCESS_TOKEN

L.tileLayer('https://api.mapbox.com/styles/v1/warnekeb/clswrfll8002e01py3vvoerv4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2FybmVrZWIiLCJhIjoiY2xzb3plZzh4MDAwdzJqczNjYnJxY3Y3dyJ9.KAtMBP36gpid7pf25U1BXQ', {
maxZoom: 19
}).addTo(map);


var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};


fetch('data/Recreation_Opportunities.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup('Name: ' + feature.properties.RECAREANAME + '</b><br />' +
                  'Activity: ' + feature.properties.MARKERACTIVITY+ '</b><br />' +
                 'Link: '+  feature.properties.RECAREAURL );
        }}
            ).addTo(map);
    })

