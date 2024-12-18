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
            mosqueData = response[0]["data"][country];
            musollahData = response[1]["data"][country];
        }
    );
    // console.log(musollahData);
    // console.log(mosqueData);
    checkAddress();
}

search();

function checkAddress(){
    let results = [];
    let searchTerm = "tampi";
    const regex = new RegExp(`/${searchTerm}/`);
    // const testString = "Your word here";
    // console.log(regex.test(testString)); // true or false

    for (const k in mosqueData){
        let arrData = mosqueData[k]["address"].toLowerCase().split(" ");
        
        arrData.filter((word)=>{
            if(regex.test(word)){
                console.log("mosque data", k);
                console.log(word, regex.test(word))
            }
            
        });
        
        if(arrData.includes(searchTerm)){
            console.log("searchTerm >>>", searchTerm);
            console.log(mosqueData[k]["address"]);
            results.push(mosqueData[k])
        }
    }
    if(results.length == 0){
        console.log("No results found.");
    }
}