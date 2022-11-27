
// Get the add Treatment form 
let addTreatmentForm = document.getElementById('add-treatment');

// Citation for the following function:
// Date: 11/13/2022
// Based on: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// On submit, collect data from the form 
addTreatmentForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTreatmentName = document.getElementById("inputTreatmentName");
    let inputTreatmentDescription = document.getElementById("inputTreatmentDescription");
    let inputTreatmentStock = document.getElementById("inputTreatmentStock")

    // Get the values from the form fields
    let treatmentName = inputTreatmentName.value;
    let treatmentDescription = inputTreatmentDescription.value;
    let treatmentStock = inputTreatmentStock.value;

    // Put our data we want to send in a javascript object
    let data = {
        treatment_name: treatmentName,
        treatment_description: treatmentDescription,
        treatment_stock: treatmentStock
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-treatment", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputTreatmentName.value = '';
            inputTreatmentDescription.value = '';
            inputTreatmentStock.value = '';

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
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Creates a new row in the Treatments table using the passed data 
addRowToTable = (data) => {

    // Get a reference to the current table
    let currentTable = document.getElementById("all-treatments");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and all cells for the row 
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");
    let stockCell = document.createElement("TD");
    let editCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");
    let editIcon = document.createElement("img")
    let deleteIcon = document.createElement("img")

    // create the edit icon 
    editIcon.class = "edit-icon"
    editIcon.src = "../assets/edit-icon.png"
    editIcon.style.width = 75 + "%";
	editIcon.style.height = 20 + "px"
    // pass data to toggleEdit function to prepopulate the edit form 
    editIcon.onclick = function(){
        toggleEdit(newRow.treatment_id, newRow.treatment_name, newRow.treatment_description, newRow.treatment_stock);}

    // create the delete icon 
    deleteIcon.class = "delete-icon"
    deleteIcon.src = "../assets/delete-icon.png"
    deleteIcon.style.width = 75 + "%";
	deleteIcon.style.height = 20 + "px"
    // pass data to showDeleteSection function to display correct information on delete form 
    deleteIcon.onclick = function(){
        showDeleteSection(`${newRow.treatment_id} : ${newRow.treatment_name}`)
    }

    // Fill the cells with correct data
    idCell.innerText = newRow.treatment_id;
    nameCell.innerText = newRow.treatment_name;
    descriptionCell.innerText = newRow.treatment_description;
    stockCell.innerText = newRow.treatment_stock;
    editCell.append(editIcon)
    deleteCell.append(deleteIcon)

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(descriptionCell);
    row.appendChild(stockCell);
    row.appendChild(editCell);
    row.appendChild(deleteCell)
    row.setAttribute('data-value', newRow.treatment_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

}

// function to display/hide edit form when the edit icon is clicked 
function toggleEdit(treatment_id, treatment_name, treatment_description, treatment_stock) { 

    // get the update form and all the fields within it 
    let element = document.getElementById("update");
    let idInput = document.getElementById("inputTreatmentIDUpdate");
    let treatmentNameInput = document.getElementById("inputTreatmentNameUpdate");
    let treatmentDescriptionInput = document.getElementById("inputTreatmentDescriptionUpdate");
    let treatmentStockInput = document.getElementById("inputTreatmentStockUpdate");

    // if it is currently not displayed, fill all the fields with the passed data and display the form 
    if (element.style.display === "none") { 
        idInput.value = treatment_id
        treatmentNameInput.value = treatment_name
        treatmentDescriptionInput.value = treatment_description
        treatmentStockInput.value = treatment_stock
        element.style.display = "block"; 
    } else {
    // otherwise hide the form and clear all the fields 
        element.style.display = "none";
        idInput.value = ''
        treatmentNameInput.value = ''
        treatmentDescriptionInput.value = ''
        treatmentStockInput.value = ''
}};
