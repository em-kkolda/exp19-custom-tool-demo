
// Hook up the initialization function
window.addEventListener("load", () => {
    elli.script.connect();
    bindToControls();
    initMap();
});

// Bind the form controls to the loan fields
async function bindToControls() {
    // Get the Loan object from the application
    let loan = await elli.script.getObject("loan");

    // Retrieve all input elements on the page
    let inputs = document.querySelectorAll("[data-field-id]");
    
    for (let i = 0; i < inputs.length; i++) {
        let elm = inputs[i];

        // Read the custom field ID attribute -- this
        // will contain the loan Field ID for the box
        let fieldId = elm.getAttribute("data-field-id");
        let fieldValue = await loan.getField(fieldId);
        if (fieldValue) elm.value = fieldValue.toString();

        // Bind to the contol's change event to update the field
        // back to the loan object
        elm.addEventListener("change", event => {
            // Create a name/value map with the field ID/value
            loan.setFields({
                [fieldId]: event.target.value
            });

            loan.calculate();
        });        
    }
}


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

