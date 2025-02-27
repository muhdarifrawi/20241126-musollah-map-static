let taraweehDistanceData = {};
let taraweehSortedDistData = {};
let taraweehRenderCount = 0;

// const taraweehModal = new bootstrap.Modal('#taraweehModal', {
//     keyboard: false
// });

async function fetchData() {let state = "dev";

    let taraweehURL;

    if (state == "dev") {
        taraweehURL = "data/qaryah-sq-2025.json";
    }
    else {
        taraweehURL = "https://raw.githubusercontent.com/muhdarifrawi/20241126-musollah-map-static/refs/heads/master/data/mosque.json";
    }

    await axios.get(taraweehURL).then(
        (response) => {
            console.log(response.data);
        }
    );
}

document.addEventListener("DOMContentLoaded", async() => {
    await fetchData();
})