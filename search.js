let musollahData;
let mosqueData;
let distanceData = {};
let sortedDistData = {};
let renderCount = 0;

const myModal = new bootstrap.Modal('#searchModal', {
    keyboard: false
});

async function fetchData() {
    let mosqueCheck = true;
    let musollahCheck = true;
    let searchEndpoints = [];

    let state = "dev";

    let mosqueURL;
    let musollahURL;

    if (state == "dev") {
        mosqueURL = "data/mosque.json";
        musollahURL = "data/musollah.json";
    }
    else {
        mosqueURL = "https://raw.githubusercontent.com/muhdarifrawi/20241126-musollah-map-static/refs/heads/master/data/mosque.json";
        musollahURL = "https://raw.githubusercontent.com/muhdarifrawi/20241126-musollah-map-static/refs/heads/master/data/musollah.json";
    }

    if (mosqueCheck == true) {
        searchEndpoints.push(mosqueURL);
    }
    if (musollahCheck == true) {
        searchEndpoints.push(musollahURL);
    }

    await axios.all(searchEndpoints.map((endpoint) => axios.get(endpoint))).then(
        (response) => {
            // console.log(response);
            // let country = "singapore";
            mosqueData = response[0]["data"];
            musollahData = response[1]["data"];
        }
    );
    console.log(musollahData);
    console.log(mosqueData);
    // checkAddress();
    // checkNearby();
}

function checkAddress() {
    let results = [];
    let searchTerm = "tampi";
    const regex = new RegExp(`/${searchTerm}/`);
    // const testString = "Your word here";
    // console.log(regex.test(testString)); // true or false

    for (const k in mosqueData) {
        let arrData = mosqueData["singapore"][k]["address"].toLowerCase().split(" ");

        arrData.filter((word) => {
            if (regex.test(word)) {
                console.log("mosque data", k);
                console.log(word, regex.test(word))
            }

        });

        if (arrData.includes(searchTerm)) {
            console.log("searchTerm >>>", searchTerm);
            console.log(mosqueData[k]["address"]);
            results.push(mosqueData[k])
        }
    }
    if (results.length == 0) {
        console.log("No results found.");
    }
}

function checkNearby() {
    console.log("===== Checking Nearby =====");
    console.log("mosque data >>>");
    console.log(mosqueData);
    console.log("===== Mosque Markers ====");
    console.log(mosqueMarkers);
    console.log("musollah data >>>");
    console.log(musollahData);

    const radius = 3000; // in meters

    // Get user's current location
    navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = L.latLng(position.coords.latitude, position.coords.longitude);
        // let distanceData = {};
        for (mosqueIndex in mosqueData) {
            // console.log(mosqueIndex);
            for (i in mosqueData[mosqueIndex]) {
                // console.log(mosqueIndex);
                let obj = mosqueData[mosqueIndex];
                // console.log(obj);
                let locationName = obj["mosque"] || obj["name"]
                let lat = obj["coordinates"][0];
                let long = obj["coordinates"][1];

                let location = [lat, long];
                const distance = userLocation.distanceTo(location);
                if (distance <= radius) {
                    distanceData[distance] = { "name": locationName, "location": [lat, long], "id": mosqueIndex, "type": "mosque" }
                }
            }
        }

        for (musollahIndex in musollahData) {
            // console.log(musollahIndex);
            for (i in musollahData[musollahIndex]) {
                // console.log(musollahIndex);
                let obj = musollahData[musollahIndex];
                // console.log(obj);
                let locationName = obj["mosque"] || obj["name"]
                let lat = obj["coordinates"][0];
                let long = obj["coordinates"][1];

                let location = [lat, long];
                const distance = userLocation.distanceTo(location);
                if (distance <= radius) {
                    distanceData[distance] = { "name": locationName, "location": [lat, long], "id": musollahIndex, "type": "musollah" }
                }
            }
        }
        console.log("=== compiled distance data ===");
        console.log(distanceData);
        // renderCards(distanceData);
        sortingData = Object.keys(distanceData)
            .sort((a, b) => {
                console.log(a, b);
                return parseInt(a) - parseInt(b);
            })
            .reduce((Obj, key) => {
                Obj[key] = distanceData[key];
                return Obj;
            }, {});
        console.log(">>>", sortedDistData);
        sortedDistData = sortingData;
        console.log(">>>", sortedDistData);
        // renderCards(sortedDistData);
    }, (error) => {
        console.error('Error fetching user location:', error.message);
    });
}

function findMarker() {

}

function locatePlace(event) {
    let coordinates = event.target.dataset.coordinates;
    let locationId;
    console.log(event.target.dataset);
    if (event.target.dataset.mosqueId) {
        locationId = event.target.dataset.mosqueId;
    }
    else if (event.target.dataset.musollahId) {
        locationId = event.target.dataset.musollahId;
    }
    console.log("LOCATION ID >>>> ", locationId);
    console.log("LOCATE PLACE COORDINATES >>>", coordinates);
    // map.panTo([coordinates.split(",")[0], coordinates.split(",")[1]]).marker().openPopup();
    map.panTo([coordinates.split(",")[0], coordinates.split(",")[1]]);
    myModal.hide();
    document.querySelectorAll(`[title=${locationId}]`)[0].click();

}

function renderCards(sortedData) {
    console.log("render cards")
    let infoGrp = document.querySelector("#info-group");
    // console.log(Object.keys(sortedDistData));
    // console.log(Object.keys(sortedDistData).length == 0);
    // console.log(Object.keys(sortedDistData).length);
    console.log(`render count ${renderCount}`);
    console.log(sortedData);
    if (Object.keys(sortedData).length != 0) {
        // clear info grp before populating again
        infoGrp.innerHTML = `<h5 class="mb-3">Within 3 km</h5>`;

        for (each in sortedData) {
            console.log(each);
            console.log("type >>> ", sortedData[each]["type"]);
            let type;
            if (sortedData[each]["type"] == "mosque") {
                type = "mosque";
            }
            else if (sortedData[each]["type"] == "musollah") {
                type = "musollah";
            }
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
                                    <button type="button" class="btn btn-outline-secondary locate"
                                    data-coordinates="${sortedData[each]["location"]}"
                                    data-${type}-id = "${type}-${sortedData[each]["id"]}">Locate</button>
                                </div>
                            </div>
                        </div>
                    </div>`
        }

        let allLocationsBtn = document.querySelectorAll(".locate");
        for (each of allLocationsBtn) {
            each.addEventListener("click", locatePlace)
        }
    }
    else if (renderCount >= 3) {
        infoGrp.innerHTML = `<div class="d-flex justify-content-center">
                                <div>
                                    <span role="status" id="alert-text" class="ms-1">Failed to fetch data.</span>
                                </div>
                            </div>`;
    }
    else {
        renderCount++;
        setTimeout(() => {
            console.log("timeout")
            renderCards(sortedDistData);
        }, 5000);

    }

}

function renderSearchCards(data) {
    console.log("render search cards")
    let searchGrp = document.querySelector("#search-group");
    searchGrp.innerHTML = `<div>
                                <span class="spinner-border spinner-border-sm" aria-hidden="true" id="spinner"></span>
                                <span role="status" id="alert-text" class="ms-1">Searching Places Within 3km</span>
                            </div>`;
    
    // console.log(Object.keys(sortedDistData));
    // console.log(Object.keys(sortedDistData).length == 0);
    // console.log(Object.keys(sortedDistData).length);
    // console.log(`render count ${renderCount}`);
    console.log(data);
    if (Object.keys(data).length != 0) {
        // clear info grp before populating again
        searchGrp.innerHTML = "";

        for (each in data) {
            console.log(each);
            // console.log("type >>> ", data[each]["type"]);
            let type;
            let name;
            if (data[each]["mosque"]) {
                type = "mosque";
                name = data[each]["mosque"];
            }
            else if (data[each]["name"]) {
                type = "musollah";
                name = data[each]["name"];
            }
            searchGrp.innerHTML += `<div class="card mb-3" style="width: 100%;">
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <h5 class="card-title">${name}</h5>
                                    <h6 class="card-subtitle mb-2" >
                                    ${data[each]["address"]}
                                    </h6>
                                </div>
                                <div class="col-3 m-auto">
                                    <button type="button" class="btn btn-outline-secondary locate"
                                    data-coordinates="${data[each]["coordinates"]}"
                                    data-${type}-id = "${type}-${data[each]["id"]}">Locate</button>
                                </div>
                            </div>
                        </div>
                    </div>`
        }

        let allLocationsBtn = document.querySelectorAll(".locate");
        for (each of allLocationsBtn) {
            each.addEventListener("click", locatePlace)
        }
    }
    // else if (renderCount >= 3) {
    //     infoGrp.innerHTML = `<div class="d-flex justify-content-center">
    //                             <div>
    //                                 <span role="status" id="alert-text" class="ms-1">Failed to fetch data.</span>
    //                             </div>
    //                         </div>`;
    // }
    // else {
    //     renderCount++;
    //     setTimeout(() => {
    //         console.log("timeout")
    //         renderCards(sortedDistData);
    //     }, 5000);

    // }
    else {
        searchGrp.innerHTML = `<div class="d-flex justify-content-center">
                                    <div class="alert alert-warning alert-dismissible fade show mb-0" role="alert" style="width:100%;">
                                    <span role="status" id="alert-text">Could not find location.</span>
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                                </div>`;
    }

}

function search() {
    console.log("search triggered");
    let searchString = document.getElementById("search-query").value;

    let searchName = true;
    let searchAddress = true;

    let foundInfo = [];
    // let searchString = "Ghufran"
    // console.log(mosqueData);
    for (each in mosqueData) {
        let mosqueName = mosqueData[each]["mosque"];
        let mosqueAddress = mosqueData[each]["address"];
        // console.log(mosqueName);
        let searchNameData;
        let searchAddressData;
        if (searchName && mosqueName.toString().toLowerCase().indexOf(searchString.toLowerCase()) >= 0) {
            console.log("FOUND MOSQUE A >>> ", mosqueData[each]);
            // foundInfo.push(mosqueData[each]);
            // if (!foundInfo.some(info => info.id === mosqueData[each]["id"])) {
            //     foundInfo.push(mosqueData[each]);
            // }
            searchNameData = mosqueData[each];
        };

        if (searchAddress && mosqueAddress.toString().toLowerCase().indexOf(searchString.toLowerCase()) >= 0) {
            console.log("FOUND MOSQUE B >>> ", mosqueData[each]);
            // foundInfo.push(mosqueData[each]);
            // if (!foundInfo.some(info => info.id === mosqueData[each]["id"])) {
            //     foundInfo.push(mosqueData[each]);
            // }
            searchAddressData = mosqueData[each];
        };

        if(searchNameData && searchNameData.toString() === searchAddressData && searchAddressData.toString()){
            foundInfo.push(mosqueData[each]);
        }
        else if (searchNameData){
            foundInfo.push(mosqueData[each]);
        }
        else if(searchAddressData){
            foundInfo.push(mosqueData[each]);
        }
    }

    for (each in musollahData) {
        let musollahName = musollahData[each]["name"];
        let musollahAddress = musollahData[each]["address"];
        // console.log(mosqueName);
        let searchNameData;
        let searchAddressData;
        if (searchName && musollahName.toString().toLowerCase().indexOf(searchString.toLowerCase()) >= 0) {
            console.log("FOUND MUSOLLAH A >>> ", musollahData[each]);
            // foundInfo.push(musollahData[each]);
            // if (!foundInfo.some(info => info.id === musollahData[each]["id"])) {
            //     foundInfo.push(mosqueData[each]);
            // }
            searchNameData = musollahData[each];
        };

        if (searchAddress && musollahAddress.toString().toLowerCase().indexOf(searchString.toLowerCase()) >= 0) {
            console.log("FOUND MUSOLLAH B >>> ", musollahData[each]);
            // foundInfo.push(musollahData[each]);
            // if (!foundInfo.some(info => info.id === musollahData[each]["id"])) {
            //     foundInfo.push(mosqueData[each]);
            // }
            searchAddressData = musollahData[each];
        };

        if(searchNameData && searchNameData.toString() === searchAddressData && searchAddressData.toString()){
            foundInfo.push(musollahData[each]);
        }
        else if (searchNameData){
            foundInfo.push(musollahData[each]);
        }
        else if(searchAddressData){
            foundInfo.push(musollahData[each]);
        }
    }

    console.log(foundInfo);
    renderSearchCards(foundInfo);
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchData();

    console.log("SEARCH CONTENT LOADING");

    let searchBtn = document.querySelector("#search-btn");
    let searchModal = document.querySelector("#searchModal");

    searchBtn.addEventListener("click", () => {
        console.log("clicked");
        // checkNearby();

        myModal.show();
        renderCards(sortedDistData);

        
        let findBtn = document.getElementById("find-btn");

        findBtn.addEventListener("click", () => { search() });
    });

})


