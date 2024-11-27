let map;
let layerControl
document.addEventListener("DOMContentLoaded", (event) => {
    map = L.map('map').setView([1.3521, 103.8198], 12);
    map.locate({setView: true, maxZoom: 12});
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    layerControl = L.control.layers().addTo(map);

    loadMosques();
    loadMusollah();
});

function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}

function openModalMusollah(data) {
    console.log("modal open", data);
    const myModal = new bootstrap.Modal('#myModal', {
        keyboard: false
    })
    const modalToggle = document.getElementById('toggleMyModal');
    myModal.show(modalToggle);

    let modalBodyEl = document.querySelector("#modal-body");

    modalBodyEl.innerHTML = `
        <h6>Address</h6>
        <p id="modal-address"></p>
        <h6>Status Description</h6>
        <p id="modal-status-description"></p>
        <h6>Layout Type</h6>
        <p id="modal-layout-type"></p>
        <h6>Layout Description</h6>
        <p id="modal-layout-description"></p>
        <h6>Wudhu Area</h6>
        <p id="modal-wudhu-area"></p>
        <h6>Directions</h6>
        <ol id="modal-directions"></ol>
        <h6>Prayer Items</h6>
        <p id="modal-prayer-items"></p>
        <h6>Important Notes</h6>
        <p id="modal-important-notes"></p>
    `;

    let modalTitleEl = document.querySelector("#modal-title");
    let modalAddressEl = document.querySelector("#modal-address");
    let modalStatusDescriptionEl = document.querySelector("#modal-status-description");
    let modalLayoutTypeEl = document.querySelector("#modal-layout-type");
    let modalLayoutDescriptionEl = document.querySelector("#modal-layout-description");
    let modalWudhuAreaEl = document.querySelector("#modal-wudhu-area");
    let modalDirectionsEl = document.querySelector("#modal-directions");
    let modalPrayerItemsEl = document.querySelector("#modal-prayer-items");
    let modalImportantNotesEl = document.querySelector("#modal-important-notes");

    let statusPill = ``;
    if(data["status"].toLowerCase() == "opened"){
        statusPill = `<span class="badge rounded-pill text-bg-success">
                        ${data["status"]}
                    </span>`;
    }
    if(data["status"].toLowerCase() == "closed"){
        statusPill = `<span class="badge rounded-pill text-bg-danger">
                        ${data["status"]}
                    </span>`;
    }

    modalTitleEl.innerHTML = `${data["name"]} ${statusPill}`;
    modalAddressEl.innerText = `${data["address"][0]}, ${data["address"][1]}`;
    modalStatusDescriptionEl.innerText = `${data["statusDescription"]}`;
    modalLayoutTypeEl.innerText = `${data["layoutType"]}`;
    modalLayoutDescriptionEl.innerText = `${data["layoutDescription"]}`;
    modalWudhuAreaEl.innerText = `${data["wudhuArea"]}`;
    data["directions"].forEach((e) => {
        modalDirectionsEl.innerHTML += `<li>${e}</li>`
    });
    modalPrayerItemsEl.innerText = `${data["prayerItems"]}`;
    data["importantNotes"] == "" ? modalImportantNotesEl.innerText = "No Info" : modalImportantNotesEl.innerText = `${data["importantNotes"]}`;
}

function openModalMosque(data) {
    console.log("modal open", data);
    const myModal = new bootstrap.Modal('#myModal', {
        keyboard: false
    })
    const modalToggle = document.getElementById('toggleMyModal');
    myModal.show(modalToggle);

    let modalBodyEl = document.querySelector("#modal-body");

    modalBodyEl.innerHTML = `
        <h6>Address</h6>
        <p id="modal-address"></p>
        <h6>Mosque Type</h6>
        <p id="modal-mosque-type"></p>
    `

    let modalTitleEl = document.querySelector("#modal-title");
    let modalAddressEl = document.querySelector("#modal-address");
    let modalMosqueTypeEl = document.querySelector("#modal-mosque-type");

    modalTitleEl.innerHTML = `${data["mosque"]}`;
    modalAddressEl.innerText = `${data["address"]}`;
    modalMosqueTypeEl.innerText = `${data["mosqueType"]}`;
}

function loadMosques() {
    var moqueIcon = L.icon({
        iconUrl: 'icons/mosque.png',

        iconSize: [36, 36], // size of the icon
        popupAnchor: [0, -14] // point from which the popup should open relative to the iconAnchor
    });
    var mosqueMarkers = new L.MarkerClusterGroup();
    axios.get("https://raw.githubusercontent.com/muhdarifrawi/20241126-musollah-map-static/refs/heads/master/data/mosque.json")
        .then(function (response) {
            console.log(response.data);
            let data = response.data;
            for (const p in data) {
                const popup = L.popup().setContent('The New Delight');
                popup.markerid = `musollah-${p}`
                mosqueMarkers.addLayer(L.marker(
                    [data[p]["coordinates"][0], data[p]["coordinates"][1]], { icon: moqueIcon })
                    .bindPopup(`<span>${data[p]["mosque"]}</span>
                        <br><a href="#" id="mosque-${p}">see more ...</a>`)
                    .openPopup());

                map.on('popupopen', () => {
                    const link = document.querySelector(`#mosque-${p}`);
                    if (link) {
                        link.addEventListener('click', (event) => {
                            event.preventDefault();
                            console.log('Clicked link id:', event.target.id);
                            openModalMosque(data[p])
                        });
                    }
                });
            }
            map.addLayer(mosqueMarkers);
            layerControl.addOverlay(mosqueMarkers, "Mosques");
        })
}

function loadMusollah() {
    var musollahIcon = L.icon({
        iconUrl: 'icons/praying.png',

        iconSize: [36, 36], // size of the icon
        popupAnchor: [0, -14] // point from which the popup should open relative to the iconAnchor
    });
    var musollahMarkers = new L.MarkerClusterGroup();
    axios.get("https://raw.githubusercontent.com/muhdarifrawi/20241126-musollah-map-static/refs/heads/master/data/musollah.json")
        .then(function (response) {
            console.log(response.data);
            let data = response.data;
            for (const p in data) {
                musollahMarkers.addLayer(L.marker([data[p]["coordinates"][0], data[p]["coordinates"][1]], { icon: musollahIcon })
                    .bindPopup(`<span>${data[p]["name"]}</span>
                    <br><a href="#" id="musollah-${p}">see more ...</a>`));

                console.log("musollah-" + p)

                map.on('popupopen', () => {
                    const link = document.querySelector(`#musollah-${p}`);
                    if (link) {
                        link.addEventListener('click', (event) => {
                            event.preventDefault();
                            console.log('Clicked link id:', event.target.id);
                            openModalMusollah(data[p])
                        });
                    }
                });
            }
            map.addLayer(musollahMarkers);
            layerControl.addOverlay(musollahMarkers, "Musollah");
        })
}

