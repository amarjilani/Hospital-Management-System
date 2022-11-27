
// Get the add Patient_Illness form 
let addPatientIllnessForm = document.getElementById('add-patient-illness');

// Citation for the following function:
// Date: 11/13/2022
// Based on: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// On submit, collect data from form 
addPatientIllnessForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPatientId = document.getElementById("inputPatientId");
    let inputIllnessId = document.getElementById("inputIllnessId");

    // Get the values from the form fields
    let patientId = inputPatientId.value;
    let illnessId = inputIllnessId.value;


    // Put our data we want to send in a javascript object
    let data = {
        patient_id: patientId,
        illness_id: illnessId
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-patient-illness", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputPatientId.value = '';
            inputIllnessId.value = '';

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

// Creates a new row in the Patients_Illnesses table using the passed data 
addRowToTable = (data) => {

    // Get a reference to the current table
    let currentTable = document.getElementById("all-patients-illnesses");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let patientIdCell = document.createElement("TD");
    let illnessIdCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");
    let deleteIcon = document.createElement("img")

    // create delete icon 
    deleteIcon.class = "delete-icon"
    deleteIcon.src = "../assets/delete-icon.png"
    deleteIcon.style.width = 75 + "%";
	deleteIcon.style.height = 20 + "px"
    // pass data to showDeleteSection function to display correct information on delete form 
    deleteIcon.onclick = function(){
        showDeleteSection(`${newRow.patient_illness_id} with Patient ID ${newRow.patient_id} and Illness ID ${newRow.illness_id}`)
    }

    // Fill the cells with correct data
    idCell.innerText = newRow.patient_illness_id;
    patientIdCell.innerText = newRow.patient_id;
    illnessIdCell.innerText = newRow.illness_id;
    deleteCell.append(deleteIcon)

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(patientIdCell);
    row.appendChild(illnessIdCell);
    row.appendChild(deleteCell)
    row.setAttribute('data-value', newRow.patient_illness_id);
    
    // Add the row to the table
    currentTable.appendChild(row);
}