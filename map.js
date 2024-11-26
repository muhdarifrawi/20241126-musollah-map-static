let map;
let layerControl
document.addEventListener("DOMContentLoaded", (event) => {
    map = L.map('map').setView([1.3521, 103.8198], 12);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    layerControl = L.control.layers().addTo(map);
    loadMosques();
    loadMusollah();
});

function loadMosques() {
    var moqueIcon = L.icon({
        iconUrl: 'icons/mosque.png',

        iconSize: [36, 36], // size of the icon
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    var mosqueMarkers = new L.MarkerClusterGroup();
    axios.get("/data/mosque.json")
        .then(function (response) {
            console.log(response.data);
            let data = response.data;
            for (const p in data) {
                mosqueMarkers.addLayer(L.marker([data[p]["coordinates"][0], data[p]["coordinates"][1]], { icon: moqueIcon }));
            }
            map.addLayer(mosqueMarkers);
            layerControl.addOverlay(mosqueMarkers, "Mosques");
        })
}

function loadMusollah() {
    var musollahIcon = L.icon({
        iconUrl: 'icons/praying.png',

        iconSize: [36, 36], // size of the icon
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    var musollahMarkers = new L.MarkerClusterGroup();
    axios.get("/data/musollah.json")
        .then(function (response) {
            console.log(response.data);
            let data = response.data;
            for (const p in data) {
                musollahMarkers.addLayer(L.marker([data[p]["coordinates"][0], data[p]["coordinates"][1]],{icon:musollahIcon}));
            }
            map.addLayer(musollahMarkers);
            layerControl.addOverlay(musollahMarkers, "Musollah");
        })
}