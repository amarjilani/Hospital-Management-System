
// Get the add Illness form 
let addIllnessForm = document.getElementById('add-illness');

// Citation for the following function:
// Date: 11/13/2022
// Based on: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// On submit, collect data from form 
addIllnessForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputIllnessName = document.getElementById("inputIllnessName");
    let inputIllnessDescription = document.getElementById("inputIllnessDescription");


    // Get the values from the form fields
    let illnessName = inputIllnessName.value;
    let illnessDescription = inputIllnessDescription.value;


    // Put our data we want to send in a javascript object
    let data = {
        illness_name: illnessName,
        illness_description: illnessDescription
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-illness", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputIllnessName.value = '';
            inputIllnessDescription.value = '';

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

// Creates a new row in the Illnesses table using the passed data 
addRowToTable = (data) => {

    // Get a reference to the current table
    let currentTable = document.getElementById("all-illnesses");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
    console.log("newRow" + newRow)

    // Create a row and all cells needed for the row 
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");
    let editCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");
    let editIcon = document.createElement("img")
    let deleteIcon = document.createElement("img")

    // create edit icon 
    editIcon.class = "edit-icon"
    editIcon.src = "../assets/edit-icon.png"
    editIcon.style.width = 75 + "%";
	editIcon.style.height = 20 + "px"
    // pass data to toggleEdit function to prepopulate the edit form 
    editIcon.onclick = function(){
        toggleEdit(newRow.illness_id, newRow.illness_name, newRow.illness_description);}
    
    // create delete icon 
    deleteIcon.class = "delete-icon"
    deleteIcon.src = "../assets/delete-icon.png"
    deleteIcon.style.width = 75 + "%";
	deleteIcon.style.height = 20 + "px"
    // pass data to showDeleteSection function to display correct information on delete form 
    deleteIcon.onclick = function(){
        showDeleteSection(`${newRow.illness_id} : ${newRow.illness_name}`)
    }

    // Fill the cells with correct data
    idCell.innerText = newRow.illness_id;
    nameCell.innerText = newRow.illness_name;
    descriptionCell.innerText = newRow.illness_description;
    editCell.append(editIcon)
    deleteCell.append(deleteIcon)

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(descriptionCell);
    row.appendChild(editCell);
    row.appendChild(deleteCell)
    row.setAttribute('data-value', newRow.illness_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

}

// function to display/hide edit form when the edit icon is clicked 
function toggleEdit(illness_id, illness_name, illness_description) { 

    // get the update form and all the fields within it 
    let element = document.getElementById("update");
    let idInput = document.getElementById("inputIllnessIDUpdate")
    let illnessNameInput = document.getElementById("inputIllnessNameUpdate")
    let illnessDescriptionInput = document.getElementById("inputIllnessDescriptionUpdate")

    // if it is currently not displayed, fill all the fielnds with the passed data and display it 
    if (element.style.display === "none") { 
        idInput.value = illness_id
        illnessNameInput.value = illness_name
        illnessDescriptionInput.value = illness_description
        element.style.display = "block"; 
    } else {
    // otherwise hide the form and clear all the fields 
        element.style.display = "none";
        idInput.value = ''
        illnessNameInput.value = ''
        illnessDescriptionInput.value = ''
}};
