// Get the objects we need to modify
let updateTreatmentForm = document.getElementById('update-treatment');

// Modify the objects we need
updateTreatmentForm.addEventListener("submit", function (e) {

    console.log(`update submitted`)
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let idInput    = document.getElementById("inputTreatmentIDUpdate")
    let nameInput = document.getElementById("inputTreatmentNameUpdate")
    let descriptionInput = document.getElementById("inputTreatmentDescriptionUpdate")
    let stockInput = document.getElementById("inputTreatmentStockUpdate")


    // Get the values from the form fields
    let treatmentIdValue      = idInput.value; 
    let treatmentNameValue    = nameInput.value;
    let treatmentDescriptionValue = descriptionInput.value;
    let treatmentStockValue = stockInput.value; 

    // Put our data we want to send in a javascript object
    let data = {
        treatment_id:           treatmentIdValue,
        treatment_name:         treatmentNameValue,
        treatment_description:  treatmentDescriptionValue,
        treatment_stock:      treatmentStockValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-treatment", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, treatmentIdValue)
            toggleEdit()

            // Clear the input fields for another transaction
            idInput.value = '';
            nameInput.value = '';
            descriptionInput.value = '';
            stockInput.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, treatment_id){
    let parsedData = JSON.parse(data);
    console.log(parsedData)
    
    let table = document.getElementById("all-treatments");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == treatment_id) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let treatmentNameTd = updateRowIndex.getElementsByTagName("td")[1];
            let treatmentDescriptionTd = updateRowIndex.getElementsByTagName("td")[2];
            let treatmentStockTd = updateRowIndex.getElementsByTagName("td")[3];
            let editTd = updateRowIndex.getElementsByTagName("td")[4];
            let deleteTd = updateRowIndex.getElementsByTagName("td")[5];

            treatmentNameTd.innerHTML = parsedData[0].treatment_name;
            treatmentDescriptionTd.innerHTML = parsedData[0].treatment_description;
            treatmentStockTd.innerHTML = parsedData[0].treatment_stock; 

            let editIcon; 
            let deleteIcon; 
            
            for (let child of editTd.children) {
                if (child.class = "edit-icon"){
                editIcon = child 
            }}

            for (let child of deleteTd.children) {
                if (child.class = "delete-icon"){
                deleteIcon = child 
            }}

            editIcon.onclick = function(){
                toggleEdit(parsedData[0].treatment_id, parsedData[0].treatment_name, parsedData[0].treatment_description, parsedData[0].treatment_stock);}

            deleteIcon.onclick = function(){
                showDeleteSection(`${parsedData[0].treatment_id} : ${parsedData[0].treatment_name}`)
            }
       }
    }
}