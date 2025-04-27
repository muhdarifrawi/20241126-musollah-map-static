let mosqueMarkers;
let musollahMarkers;
let map;
let layerControl;

let mosqueURL;
let musollahURL;

let state = "dev";

if (state == "dev") {
    // mosqueURL = "data/mosque.json";
    // musollahURL = "data/musollah.json";
    mosqueURL = "https://raw.githubusercontent.com/muhdarifrawi/20241126-musollah-map-static/refs/heads/master/data/mosque.json";
    musollahURL = "https://raw.githubusercontent.com/muhdarifrawi/20241126-musollah-map-static/refs/heads/master/data/musollah.json";
}
else {
    mosqueURL = "https://raw.githubusercontent.com/muhdarifrawi/20241126-musollah-map-static/refs/heads/master/data/mosque.json";
    musollahURL = "https://raw.githubusercontent.com/muhdarifrawi/20241126-musollah-map-static/refs/heads/master/data/musollah.json";
}


function onLocationFound(e) {
    var radius = e.accuracy;

    let userIcon = L.icon({
        iconUrl: 'icons/user-coloured.png',

        iconSize: [45, 45], // size of the icon
        iconAnchor: [20, 31], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -14] // point from which the popup should open relative to the iconAnchor
    });

    L.marker(e.latlng, {icon: userIcon}).addTo(map).on('click', function(e){
        map.setView(e.latlng, 18);
    });;

    L.circle(e.latlng, radius).setStyle({color: '#FED401'}).addTo(map);
    map.setView(e.latlng, 18);

    checkNearby();

    document.querySelector("#custom-alert").style.display = "none";
}

function onLocationError(e) {
    console.error(e.message);
    document.querySelector("#custom-alert").classList.remove("alert-info");
    document.querySelector("#spinner").remove();
    document.querySelector("#custom-alert").classList.add("alert-danger");
    document.querySelector("#alert-text").innerText = "Could not find user location.";
}

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

    // let country = "singapore";
    // loadMosques(country);
    // loadMusollah(country);
    loadMosques();
    loadMusollah();
    // loadTaraweeh();
});

function largeImageModal(url) {
    // console.log("click");
    // document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    // const largeImageModalEl = new bootstrap.Modal('#large-image-modal', {
    //     keyboard: false
    // })

    // largeImageModalEl.show();
    let largeImageModalEl = document.querySelector("#large-image-modal");
    largeImageModalEl.style.display = "block";
    
    let modalImageBodyEl = document.querySelector("#large-modal-image-body");
    let closeButton = document.querySelector("#back-to-main");

    modalImageBodyEl.innerHTML = `
        <img src=${url} class="img-fluid w-100 border rounded"/>
    `;

    closeButton.addEventListener('click', function () {
        // const imageModalInstance = bootstrap.Modal.getInstance(document.getElementById('large-image-modal'));
        // imageModalInstance.hide();
        // const mainModal = new bootstrap.Modal(document.getElementById('myModal'));
        // mainModal.show();
        // document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        largeImageModalEl.style.display = "none";
    })
}

function openModalMusollah(data) {
    // // console.log("modal open", data);
    const myModal = new bootstrap.Modal('#myModal', {
        keyboard: false
    })
    const modalToggle = document.getElementById('toggleMyModal');
    myModal.show(modalToggle);

    let modalBodyEl = document.querySelector("#modal-body");

    modalBodyEl.innerHTML = `
        <h6 class="fw-bold">Images (${data["images"].length != 0 && data["images"][0] != "" ? data["images"].length : "0"}) </h6>
        <div id="modal-images" class="d-flex overflow-x-scroll"></div>
        <h6 class="fw-bold mt-3">Address</h6>
        <p id="modal-address"></p>
        <h6 class="fw-bold">Opening Hours Information</h6>
        <p id="modal-status-description"></p>
        <h6 class="fw-bold">Estimated Capacity per Area</h6>
        <p id="modal-area-capacity"></p>
        <h6 class="fw-bold">Layout Type</h6>
        <p id="modal-layout-type"></p>
        <h6 class="fw-bold">Layout Description</h6>
        <p id="modal-layout-description"></p>
        <h6 class="fw-bold">Wudhu Area</h6>
        <p id="modal-wudhu-area"></p>
        <h6 class="fw-bold">Directions</h6>
        <ol id="modal-directions"></ol>
        <h6 class="fw-bold">Prayer Items</h6>
        <p id="modal-prayer-items"></p>
        <h6 class="fw-bold">Important Notes</h6>
        <p id="modal-important-notes"></p>
    `;

    let modalTitleEl = document.querySelector("#modal-title");
    let modalImagesEl = document.querySelector("#modal-images");
    let modalAddressEl = document.querySelector("#modal-address");
    let modalStatusDescriptionEl = document.querySelector("#modal-status-description");
    let modalAreaCapacityEl = document.querySelector("#modal-area-capacity");
    let modalLayoutTypeEl = document.querySelector("#modal-layout-type");
    let modalLayoutDescriptionEl = document.querySelector("#modal-layout-description");
    let modalWudhuAreaEl = document.querySelector("#modal-wudhu-area");
    let modalDirectionsEl = document.querySelector("#modal-directions");
    let modalPrayerItemsEl = document.querySelector("#modal-prayer-items");
    let modalImportantNotesEl = document.querySelector("#modal-important-notes");
    let modalButtonsArea = document.querySelector("#modal-footer");
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
    modalImagesEl.innerHTML = `${data["images"].length != 0 && data["images"][0] != "" ? (data["images"]).map((url)=>{
        return (
            `<img src=${url} class="img-thumbnail me-3 my-3" style="height:150px;"/>`
        )
    }).join("") : "No Images"}`
    modalAddressEl.innerText = `${data["address"][0]}, ${data["address"][1]}`;
    modalStatusDescriptionEl.innerText = `${data["statusDescription"]}`;
    modalAreaCapacityEl.innerText = `${data["areaCapacity"]} pax per area`
    modalLayoutTypeEl.innerText = `${data["layoutType"]}`;
    modalLayoutDescriptionEl.innerText = `${data["layoutDescription"]}`;
    modalWudhuAreaEl.innerText = `${data["wudhuArea"]}`;
    data["directions"].forEach((e) => {
        modalDirectionsEl.innerHTML += `<li>${e}</li>`
    });
    modalPrayerItemsEl.innerText = `${data["prayerItems"]}`;
    data["importantNotes"] == "" ? modalImportantNotesEl.innerText = "No Info" : modalImportantNotesEl.innerText = `${data["importantNotes"]}`;

    modalButtonsArea.innerHTML = `
                    <a href="http://maps.apple.com/?daddr='${data["address"][0]}'" target="_blank" role="button" class="btn btn-success">Apple Navigation</a>
                    <a href="https://www.google.com/maps/dir/?api=1&destination='${data["address"][0]}'" target="_blank" role="button" class="btn btn-success">Google Navigation</a>
                    `

    modalImagesEl.addEventListener("click", (event) => {
        // // console.log(event.target.src);
        // const mainModal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
        // mainModal.hide();
        largeImageModal(event.target.src);
    })
}

function openModalMosque(data) {
    // // console.log("modal open", data);
    const myModal = new bootstrap.Modal('#myModal', {
        keyboard: false
    });
    
    myModal.show();

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
    mosqueMarkers = new L.MarkerClusterGroup();
    axios.get(mosqueURL)
        .then(function (response) {
            // // console.log("MOSQUE DATA: ", response.data);
            let data = response.data;
            for (const p in data) {
                let mosqueId = data[p]["id"];
                const popup = L.popup().setContent('The New Delight');
                popup.markerid = `mosque-${mosqueId}`
                mosqueMarkers.addLayer(L.marker(
                    [data[p]["coordinates"][0], data[p]["coordinates"][1]], { icon: moqueIcon , title:`mosque-${mosqueId}`})
                    .bindPopup(`<span>${data[p]["mosque"]}</span>
                        <br><a href="#" id="mosque-${p}">see more ...</a>`)
                    .openPopup());

                map.on('popupopen', () => {
                    const link = document.querySelector(`#mosque-${mosqueId}`);
                    if (link) {
                        link.addEventListener('click', (event) => {
                            event.preventDefault();
                            // // console.log('Clicked link id:', event.target.id);
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
    musollahMarkers = new L.MarkerClusterGroup();
    axios.get(musollahURL)
        .then(function (response) {
            // // console.log("MUSOLLAH DATA: ", response.data);
            let data = response.data;
            for (const p in data) {
                let musollahId = data[p]["id"];
                musollahMarkers.addLayer(L.marker([data[p]["coordinates"][0], data[p]["coordinates"][1]], { icon: musollahIcon, title:`musollah-${musollahId}`})
                    .bindPopup(`<span>${data[p]["name"]}</span>
                    <br><a href="#" id="musollah-${p}">see more ...</a>`));

                // // console.log("musollah-" + p)

                map.on('popupopen', () => {
                    const link = document.querySelector(`#musollah-${musollahId}`);
                    if (link) {
                        link.addEventListener('click', (event) => {
                            event.preventDefault();
                            // // console.log('Clicked link id:', event.target.id);
                            openModalMusollah(data[p])
                        });
                    }
                });
            }
            map.addLayer(musollahMarkers);
            layerControl.addOverlay(musollahMarkers, "Musollah");
        })
}


