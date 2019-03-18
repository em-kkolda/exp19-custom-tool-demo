
// Load the google map with the subject property's location
async function initMap() {
    // Fetch the loan object
    let loan = await elli.script.getObject("loan");

    // Read the property address fields
    let prop = {
        streetAddress: await loan.getField("11"),
        city: await loan.getField("12"),
        state: await loan.getField("14"),
        postalCode: await loan.getField("15")
    };

    if (!prop.streetAddress || !prop.city || !prop.state || !prop.postalCode) {
        return;
    }

    // Convert address to string
    let addr = prop.streetAddress + "," + prop.city + 
        " " + prop.state + " " + prop.postalCode;
    
    // Use Geocoder to convert address to lat/long
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': addr}, (results, status) => {
        if (status == 'OK') {
            let map = new google.maps.Map(document.getElementById('map'), {
                center: results[0].geometry.location,
                zoom: 18
            });
            let marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        }
    });
}
