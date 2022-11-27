
// Get the add Illness_Treatment form 
let addIllnessForm = document.getElementById('add-illness-treatment');

// Citation for the following function:
// Date: 11/13/2022
// Based on: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// On submit, collect data from the form 
addIllnessForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputIllnessId = document.getElementById("inputIllnessId");
    let inputTreatmentId = document.getElementById("inputTreatmentId");

    // Get the values from the form fields
    let illnessId = inputIllnessId.value;
    let treatmentId = inputTreatmentId.value;


    // Put our data we want to send in a javascript object
    let data = {
        illness_id: illnessId,
        treatment_id: treatmentId
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-illness-treatment", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputIllnessId.value = '';
            inputTreatmentId.value = '';

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

// Creates a new row in the Illnesses_Treatments table using the passed data 
addRowToTable = (data) => {

    // Get a reference to the current table
    let currentTable = document.getElementById("all-illnesses-treatments");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
    console.log("newRow" + newRow)

    // Create a row and all the cells needed for that row 
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let illnessIdCell = document.createElement("TD");
    let illnessNameCell = document.createElement("TD");
    let treatmentIdCell = document.createElement("TD");
    let treatmentNameCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");
    let deleteIcon = document.createElement("img")

    // create delete icon 
    deleteIcon.class = "delete-icon"
    deleteIcon.src = "../assets/delete-icon.png"
    deleteIcon.style.width = 75 + "%";
	deleteIcon.style.height = 20 + "px"
    // pass data to showDeleteSection function to display correct information on delete form 
    deleteIcon.onclick = function(){
        showDeleteSection(`${newRow.illness_treatment_id} with Illness ID ${newRow.illness_id} and Treatment ID ${newRow.treatment_id}`)
    }

    // Fill the cells with the data
    idCell.innerText = newRow.illness_treatment_id;
    illnessIdCell.innerText = newRow.illness_id;
    illnessNameCell.innerText = newRow.illness_name;
    treatmentIdCell.innerText = newRow.treatment_id;
    treatmentNameCell.innerText = newRow.treatment_name;
    deleteCell.append(deleteIcon)

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(illnessIdCell);
    row.appendChild(illnessNameCell)
    row.appendChild(treatmentIdCell);
    row.appendChild(treatmentNameCell)
    row.appendChild(deleteCell)
    row.setAttribute('data-value', newRow.illness_treatment_id);
    
    // Add the row to the table
    currentTable.appendChild(row);
}