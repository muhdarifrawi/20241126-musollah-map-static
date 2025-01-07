let musollahData;
let mosqueData;
let distanceData = {};

async function fetchData() {
    let mosqueCheck = true;
    let musollahCheck = true;
    let searchEndpoints = [];

    if (mosqueCheck == true) {
        searchEndpoints.push("https://raw.githubusercontent.com/muhdarifrawi/20241126-musollah-map-static/refs/heads/master/data/mosque.json");
    }
    if (musollahCheck == true) {
        searchEndpoints.push("https://raw.githubusercontent.com/muhdarifrawi/20241126-musollah-map-static/refs/heads/master/data/musollah.json");
    }

    await axios.all(searchEndpoints.map((endpoint) => axios.get(endpoint))).then(
        (response) => {
            // console.log(response);
            let country = "singapore";
            mosqueData = response[0]["data"];
            musollahData = response[1]["data"];
        }
    );
    console.log(musollahData);
    console.log(mosqueData);
    // checkAddress();
    checkNearby();
}

// search();

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
    console.log("musollah data >>>");
    console.log(musollahData);

    const radius = 1000; // in meters

    // Get user's current location
    navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = L.latLng(position.coords.latitude, position.coords.longitude);
        // let distanceData = {};
        for (country in mosqueData) {
            console.log(country);
            for (i in mosqueData[country]) {
                // console.log(i);
                let obj = mosqueData[country][i];
                // console.log(obj);
                let locationName = obj["mosque"] || obj["name"]
                let lat = obj["coordinates"][0];
                let long = obj["coordinates"][1];

                let location = [lat, long];
                const distance = userLocation.distanceTo(location);

                distanceData[distance] = { "name": locationName, "location": [lat, long] }
            }
        }

        for (country in musollahData) {
            console.log(country);
            for (i in musollahData[country]) {
                // console.log(i);
                let obj = musollahData[country][i];
                // console.log(obj);
                let locationName = obj["mosque"] || obj["name"]
                let lat = obj["coordinates"][0];
                let long = obj["coordinates"][1];

                let location = [lat, long];
                const distance = userLocation.distanceTo(location);

                distanceData[distance] = { "name": locationName, "location": [lat, long] }
            }
        }
        console.log("=== compiled distance data ===");
        console.log(distanceData);
        // renderCards(distanceData);
    }, (error) => {
        console.error('Error fetching user location:', error.message);
    });
}

function renderCards(distanceData) {
    console.log("render cards")
    let infoGrp = document.querySelector("#info-group");
    for (each in distanceData) {
        console.log(each);
        infoGrp.innerHTML += `<div class="card mb-3" style="width: 100%;">
                        <div class="card-body">
                            <h5 class="card-title">${distanceData[each]["name"]}</h5>
                            <h6 class="card-subtitle mb-2 text-body-secondary">${each} meters</h6>
                            <a href="#" class="card-link">Card link</a>
                            <a href="#" class="card-link">Another link</a>
                        </div>
                    </div>`
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchData();
    console.log("SEARCH CONTENT LOADING");

    let searchBtn = document.querySelector("#search-btn");
    let searchModal = document.querySelector("#searchModal");

    searchBtn.addEventListener("click", () => {
        console.log("clicked");
        // checkNearby();
        renderCards(distanceData);
        const myModal = new bootstrap.Modal('#searchModal', {
            keyboard: false
        });

        myModal.show();
    });
})


