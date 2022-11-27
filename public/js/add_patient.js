
// Get the add Patient form 
let addPatientForm = document.getElementById('add-patient');

// Citation for the following function:
// Date: 11/13/2022
// Based on: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// On submit, collectt data from form 
addPatientForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPatientFname = document.getElementById("inputPatientFname");
    let inputPatientLname = document.getElementById("inputPatientLname");
    let inputPatientAge = document.getElementById("inputPatientAge");
    let inputPatientEmail = document.getElementById("inputPatientEmail");
    let inputPatientPhone = document.getElementById("inputPatientPhone");

    // Get the values from the form fields
    let patientFnameValue = inputPatientFname.value;
    let patientLnameValue = inputPatientLname.value;
    let patientAgeValue  = inputPatientAge.value;
    let patientEmailValue = inputPatientEmail.value;
    let patientPhoneValue = inputPatientPhone.value;

    // Put our data we want to send in a javascript object
    let data = {
        patient_fname: patientFnameValue,
        patient_lname: patientLnameValue,
        patient_email: patientEmailValue,
        patient_age: patientAgeValue,
        patient_phone_number: patientPhoneValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-patient", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputPatientFname.value = '';
            inputPatientLname.value = '';
            inputPatientAge.value = '';
            inputPatientEmail.value = '';
            inputPatientPhone.value = '';
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

// Creates a new row in the Patients table using the passed data 
addRowToTable = (data) => {

    // Get a reference to the current table
    let currentTable = document.getElementById("all-patients");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and all the cells needed for that row 
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let ageCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let phoneNumberCell = document.createElement("TD");
    let editCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");
    let editIcon = document.createElement("img")
    let deleteIcon = document.createElement("img")

    // create the edit icon 
    editIcon.class = "edit-icon"
    editIcon.src = "../assets/edit-icon.png"
    editIcon.style.width = 75 + "%";
	editIcon.style.height = 20 + "px"
    // pass data to the toggleEdit function to prepopulate the edit form 
    editIcon.onclick = function(){
        toggleEdit(newRow.patient_id, newRow.patient_fname, newRow.patient_lname, newRow.patient_age, newRow.patient_email, newRow.patient_phone_number);}
    
    // create the delete icon 
    deleteIcon.class = "delete-icon"
    deleteIcon.src = "../assets/delete-icon.png"
    deleteIcon.style.width = 75 + "%";
	deleteIcon.style.height = 20 + "px"
    // pass data to showDeleteSection function to display correct information on delete form 
    deleteIcon.onclick = function(){
        showDeleteSection(`${newRow.patient_id} : ${newRow.patient_fname} ${newRow.patient_lname}`)
    }

    // Fill the cells with correct data
    idCell.innerText = newRow.patient_id;
    firstNameCell.innerText = newRow.patient_fname;
    lastNameCell.innerText = newRow.patient_lname;
    ageCell.innerText = newRow.patient_age;
    emailCell.innerText = newRow.patient_email;
    phoneNumberCell.innerText = newRow.patient_phone_number;
    editCell.append(editIcon)
    deleteCell.append(deleteIcon)

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(ageCell);
    row.appendChild(emailCell);
    row.appendChild(phoneNumberCell);
    row.appendChild(editCell);
    row.appendChild(deleteCell)
    // set the value of the row as the patient_id 
    row.setAttribute('data-value', newRow.patient_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

}

//function to display/hide edit form when the edit icon is clicked 
function toggleEdit(patient_id, patient_fname, patient_lname, patient_age, patient_email, patient_phone_number) { 

    // get the edit Patient form and all the fields in that form 
    let element = document.getElementById("update");
    let idInput = document.getElementById("inputPatientIDUpdate")
    let fnameInput = document.getElementById("inputPatientFnameUpdate")
    let lnameInput = document.getElementById("inputPatientLnameUpdate")
    let ageInput   = document.getElementById("inputPatientAgeUpdate")
    let emailInput = document.getElementById("inputPatientEmailUpdate")
    let phoneInput = document.getElementById("inputPatientPhoneUpdate")

    // if it is currently not displayed, fill all the fields with the passed data and display the form 
    if (element.style.display === "none") { 
        idInput.value = patient_id
        fnameInput.value = patient_fname
        lnameInput.value = patient_lname
        ageInput.value = patient_age
        emailInput.value = patient_email
        phoneInput.value = patient_phone_number
        element.style.display = "block"; 
    } else {
    // otherwise hide the form and clear all the fields    
        element.style.display = "none";
        idInput.value = ''
        fnameInput.value = ''
        lnameInput.value = ''
        ageInput.value = ''
        emailInput.value = ''
        phoneInput.value = ''
}};

