let qaryahData;
let qaryahRenderCount = 0;
let distanceDataQaryah = {};
let sortedDistDataQaryah = {};
let renderCountQaryah = 0;

const qaryahModal = new bootstrap.Modal('#qaryahModal', {
    keyboard: false
});

async function fetchQaryahData() {let state = "dev";

    let taraweehURL;

    if (state == "dev") {
        taraweehURL = "data/qaryah-sq-2025.json";
    }
    else {
        taraweehURL = "https://raw.githubusercontent.com/muhdarifrawi/20241126-musollah-map-static/refs/heads/master/data/mosque.json";
    }

    await axios.get(taraweehURL).then(
        (response) => {
            // console.log(response.data);
            qaryahData = response.data;
        }
    );
}

function checkNearbyQaryah() {
    // console.log("===== Checking Nearby =====");
    // console.log("mosque data >>>");
    // console.log(mosqueData);
    // console.log("===== Mosque Markers ====");
    // console.log(mosqueMarkers);
    // console.log("musollah data >>>");
    // console.log(musollahData);

    const radius = 3000; // in meters

    // Get user's current location
    navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = L.latLng(position.coords.latitude, position.coords.longitude);
        // let distanceData = {};
        for (qaryahIndex in qaryahData) {
            // // console.log(mosqueIndex);
            for (i in qaryahData[qaryahIndex]) {
                // // console.log(mosqueIndex);
                let obj = qaryahData[qaryahIndex];
                // // console.log(obj);
                let locationName = "Qaryah " + obj["id"];
                let lat = obj["coordinates"][0];
                let long = obj["coordinates"][1];

                let location = [lat, long];
                const distance = userLocation.distanceTo(location);
                if (distance <= radius) {
                    distanceDataQaryah[distance] = { "name": locationName, "location": [lat, long], "id": obj["id"], "type": "qaryah" }
                }
            }
        }

        
        // console.log("=== compiled distance data ===");
        // console.log(distanceData);

        sortingData = Object.keys(distanceDataQaryah)
            .sort((a, b) => {
                // console.log(a, b);
                return parseInt(a) - parseInt(b);
            })
            .reduce((Obj, key) => {
                Obj[key] = distanceDataQaryah[key];
                return Obj;
            }, {});

        sortedDistDataQaryah = sortingData;
        
    }, (error) => {
        console.error('Error fetching user location:', error.message);
    });
}

function renderQaryahCards(sortedData) {
    // console.log("render cards")
    let infoGrp = document.querySelector("#info-group-qaryah");
    // console.log(Object.keys(sortedDistDataQaryah));
    // console.log(Object.keys(sortedDistData).length == 0);
    // console.log(Object.keys(sortedDistData).length);
    // console.log(`render count ${renderCount}`);
    console.log(sortedDistDataQaryah);
    if (Object.keys(sortedData).length != 0) {
        // clear info grp before populating again
        infoGrp.innerHTML = `<h5 class="mb-3">Within 3 km</h5>`;

        for (each in sortedData) {
            // console.log(each);
            // console.log("type >>> ", sortedData[each]["type"]);
            let type = sortedData[each]["type"];
            infoGrp.innerHTML += `<div class="card mb-3" style="width: 100%;">
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <h5 class="card-title">${sortedData[each]["name"]}</h5>
                                    <h6 class="card-subtitle mb-2 
                                    ${parseFloat(each) < 500 ? "text-success" : ""}
                                    ${parseFloat(each) >= 500 && parseFloat(each) < 1000 ? "text-warning" : ""}
                                    ${parseFloat(each) >= 1000 ? "text-danger" : ""}
                                    ">
                                    ${parseFloat(each) < 500 ? "less than 500m" : ""}
                                    ${parseFloat(each) >= 500 && parseFloat(each) < 1000 ? "less than 1km" : ""}
                                    ${parseFloat(each) >= 1000 ? (+(parseFloat(each) / 1000).toFixed(2)).toString() + "km" : ""}
                                    </h6>
                                </div>
                                <div class="col-3 m-auto">
                                    <button type="button" class="btn btn-outline-secondary locate-qaryah"
                                    data-coordinates="${sortedData[each]["location"]}"
                                    data-${type}-id = "${type}-${sortedData[each]["id"]}">Locate</button>
                                </div>
                            </div>
                        </div>
                    </div>`
        }

        let allQaryahLocationsBtn = document.querySelectorAll(".locate-qaryah");
        for (each of allQaryahLocationsBtn) {
            each.addEventListener("click", locateQaryah)
        }
    }
    else if (renderCountQaryah >= 3) {
        infoGrp.innerHTML = `<div class="d-flex justify-content-center">
                                <div>
                                    <span role="status" id="alert-text" class="ms-1">Failed to fetch data.</span>
                                </div>
                            </div>`;
    }
    else {
        renderCountQaryah++;
        setTimeout(() => {
            // console.log("timeout")
            renderQaryahCards(sortedDistDataQaryah);
        }, 5000);

    }

}

function locateQaryah(event) {
    let coordinates = event.target.dataset.coordinates;
    let qaryahLocationId;
    // console.log(event.target.dataset);
    qaryahLocationId = event.target.dataset.qaryahId;
    
    // console.log("LOCATION ID >>>> ", qaryahLocationId);
    // console.log("LOCATE PLACE COORDINATES >>>", coordinates);
    // map.panTo([coordinates.split(",")[0], coordinates.split(",")[1]]).marker().openPopup();
    map.panTo([coordinates.split(",")[0], coordinates.split(",")[1]]);
    qaryahModal.hide();
    document.querySelectorAll(`[title=${qaryahLocationId}]`)[0].click();

}

document.addEventListener("DOMContentLoaded", async() => {
    await fetchQaryahData();

    let qaryahBtn = document.querySelector("#qaryah-btn");
    // let searchModal = document.querySelector("#searchModal");

    qaryahBtn.addEventListener("click", () => {
        console.log("clicked");

        qaryahModal.show();
        renderQaryahCards(sortedDistDataQaryah);
    });
})