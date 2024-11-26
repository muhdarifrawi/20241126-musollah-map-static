let map;

document.addEventListener("DOMContentLoaded", (event) => {
    map = L.map('map').setView([1.3521, 103.8198], 12);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    loadMosques();
});

function loadMosques(){
    var markers = new L.MarkerClusterGroup();
    // const axios = require('axios');
    axios.get("/data/mosque.json")
    .then(function(response){
        console.log(response.data);
        let data = response.data;
        for(const p in data){
            markers.addLayer(L.marker([data[p]["coordinates"][0], data[p]["coordinates"][1]]));
        }
        map.addLayer(markers);
    })
}
