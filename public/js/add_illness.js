
// Get the objects we need to modify
let addIllnessForm = document.getElementById('add-illness');

// Modify the objects we need
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
    console.log(data)
    
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


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {
    console.log(data)

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("all-illnesses");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
    console.log("newRow" + newRow)

    // Create a row and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");
    let editCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");
    let editIcon = document.createElement("img")
    let deleteIcon = document.createElement("img")

    editIcon.class = "edit-icon"
    editIcon.src = "../assets/edit-icon.png"
    editIcon.style.width = 75 + "%";
	editIcon.style.height = 20 + "px"
    editIcon.onclick = function(){
        toggleEdit(newRow.illness_id, newRow.illness_name, newRow.illness_description);}

    deleteIcon.class = "delete-icon"
    deleteIcon.src = "../assets/delete-icon.png"
    deleteIcon.style.width = 75 + "%";
	deleteIcon.style.height = 20 + "px"
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
function toggleEdit(illness_id, illness_name, illness_description) { 
    let element = document.getElementById("update");
    let idInput = document.getElementById("inputIllnessIDUpdate")
    let illnessNameInput = document.getElementById("inputIllnessNameUpdate")
    let illnessDescriptionInput = document.getElementById("inputIllnessDescriptionUpdate")

    if (element.style.display === "none") { 
        idInput.value = illness_id
        illnessNameInput.value = illness_name
        illnessDescriptionInput.value = illness_description
        element.style.display = "block"; 
    } else {
        element.style.display = "none";
        idInput.value = ''
        illnessNameInput.value = ''
        illnessDescriptionInput.value = ''
}};
