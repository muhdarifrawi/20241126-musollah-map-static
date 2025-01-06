let musollahData;
let mosqueData;

async function search() {
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
    // console.log(musollahData);
    // console.log(mosqueData);
    // checkAddress();
    checkNearby();
}

search();

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

    // for (country in mosqueData) {
    //     console.log(country);
    //     for(i in mosqueData[country]){
    //         console.log(i);
    //         let obj = mosqueData[country][i];
    //         console.log(obj);
    //         let lat = obj["coordinates"][0];
    //         let long = obj["coordinates"][1];


    //     }
    // }
    // Assuming `map` is your Leaflet map instance and `markers` is an array of marker objects

    // Radius in meters
    const radius = 1000; // in meters

    // Get user's current location
    navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = L.latLng(position.coords.latitude, position.coords.longitude);
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

                if (distance <= radius) {
                    console.log(`${locationName} is within ${radius} meters`);
                }
                // else {
                //     console.log(`Marker at ${location} is outside ${radius} meters`);
                // }
            }
        }
        // markers.forEach((marker) => {
        //     const markerLocation = marker.getLatLng();
        //     const distance = userLocation.distanceTo(markerLocation);

        //     if (distance <= radius) {
        //         console.log(`Marker at ${markerLocation} is within ${radius} meters`);
        //     } else {
        //         console.log(`Marker at ${markerLocation} is outside ${radius} meters`);
        //     }
        // });
    }, (error) => {
        console.error('Error fetching user location:', error.message);
    });
}


