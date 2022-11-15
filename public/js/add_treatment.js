
// Get the objects we need to modify
let addTreatmentForm = document.getElementById('add-treatment');

// Modify the objects we need
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
    console.log(data)
    
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


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {
    console.log(data)

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("all-treatments");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
    console.log("newRow" + newRow)

    // Create a row and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");
    let stockCell = document.createElement("TD");
    let editCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");
    let editIcon = document.createElement("img")
    let deleteIcon = document.createElement("img")

    editIcon.class = "edit-icon"
    editIcon.src = "../assets/edit-icon.png"
    editIcon.style.width = 75 + "%";
	editIcon.style.height = 20 + "px"
    editIcon.onclick = function(){
        toggleEdit(newRow.treatment_id, newRow.treatment_name, newRow.treatment_description, newRow.treatment_stock);}

    deleteIcon.class = "delete-icon"
    deleteIcon.src = "../assets/delete-icon.png"
    deleteIcon.style.width = 75 + "%";
	deleteIcon.style.height = 20 + "px"
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
function toggleEdit(treatment_id, treatment_name, treatment_description, treatment_stock) { 
    let element = document.getElementById("update");
    let idInput = document.getElementById("inputTreatmentIDUpdate");
    let treatmentNameInput = document.getElementById("inputTreatmentNameUpdate");
    let treatmentDescriptionInput = document.getElementById("inputTreatmentDescriptionUpdate");
    let treatmentStockInput = document.getElementById("inputTreatmentStockUpdate");

    if (element.style.display === "none") { 
        idInput.value = treatment_id
        treatmentNameInput.value = treatment_name
        treatmentDescriptionInput.value = treatment_description
        treatmentStockInput.value = treatment_stock
        element.style.display = "block"; 
    } else {
        element.style.display = "none";
        idInput.value = ''
        treatmentNameInput.value = ''
        treatmentDescriptionInput.value = ''
        treatmentStockInput.value = ''
}};
