// Get the update Treatment form 
let updateTreatmentForm = document.getElementById('update-treatment');

// Citation for the following function:
// Date: 11/13/2022
// Based on: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// On submit, collect data from the form 
updateTreatmentForm.addEventListener("submit", function (e) {
    
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

            // Add the new data to the table and hide the form 
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

// Citation for the following function:
// Date: 11/13/2022
// Based on: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// function to update a specific row within the Treatments table 
function updateRow(data, treatment_id){
    let parsedData = JSON.parse(data);
    
    // gets the Treatments table 
    let table = document.getElementById("all-treatments");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows to find the row that matches the updated Treatment based on ID 
       if (table.rows[i].getAttribute("data-value") == treatment_id) {

            // get the index of the row to update 
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get all the TD elements in that row 
            let treatmentNameTd = updateRowIndex.getElementsByTagName("td")[1];
            let treatmentDescriptionTd = updateRowIndex.getElementsByTagName("td")[2];
            let treatmentStockTd = updateRowIndex.getElementsByTagName("td")[3];
            let editTd = updateRowIndex.getElementsByTagName("td")[4];
            let deleteTd = updateRowIndex.getElementsByTagName("td")[5];

            // fill all the TD elements with the relevant data 
            treatmentNameTd.innerHTML = parsedData[0].treatment_name;
            treatmentDescriptionTd.innerHTML = parsedData[0].treatment_description;
            treatmentStockTd.innerHTML = parsedData[0].treatment_stock; 

            let editIcon; 
            let deleteIcon; 
            
            // get the edit and delete icons from the edit and delete cells 
            for (let child of editTd.children) {
                if (child.class = "edit-icon"){
                editIcon = child 
            }}

            for (let child of deleteTd.children) {
                if (child.class = "delete-icon"){
                deleteIcon = child 
            }}

            // update the onclick functions to use the newly updated information 
            editIcon.onclick = function(){
                toggleEdit(parsedData[0].treatment_id, parsedData[0].treatment_name, parsedData[0].treatment_description, parsedData[0].treatment_stock);}

            deleteIcon.onclick = function(){
                showDeleteSection(`${parsedData[0].treatment_id} : ${parsedData[0].treatment_name}`)
            }
       }
    }
}