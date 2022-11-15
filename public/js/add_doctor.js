
// Get the objects we need to modify
let addDoctorForm = document.getElementById('add-doctor');

// Modify the objects we need
addDoctorForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDoctorFname = document.getElementById("inputDoctorFname");
    let inputDoctorLname = document.getElementById("inputDoctorLname");
    let inputDoctorEmail = document.getElementById("inputDoctorEmail");
    let inputDoctorPhone = document.getElementById("inputDoctorPhone");

    // Get the values from the form fields
    let doctorFnameValue = inputDoctorFname.value;
    let doctorLnameValue = inputDoctorLname.value;
    let doctorEmailValue = inputDoctorEmail.value;
    let doctorPhoneValue = inputDoctorPhone.value;

    // Put our data we want to send in a javascript object
    let data = {
        doctor_fname: doctorFnameValue,
        doctor_lname: doctorLnameValue,
        doctor_email: doctorEmailValue,
        doctor_phone_number: doctorPhoneValue
    }
    
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-doctor", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDoctorFname.value = '';
            inputDoctorLname.value = '';
            inputDoctorEmail.value = '';
            inputDoctorPhone.value = '';
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

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("all-doctors");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
    console.log("newRow" + newRow)

    // Create a row and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let phoneNumberCell = document.createElement("TD");
    let editCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");
    let editIcon = document.createElement("img")
    let deleteIcon = document.createElement("img")

    editIcon.class = "edit-icon"
    editIcon.src = "../assets/edit-icon.png"
    editIcon.style.width = 75 + "%";
	editIcon.style.height = 20 + "px"
    editIcon.onclick = function(){
        toggleEdit(newRow.doctor_id, newRow.doctor_fname, newRow.doctor_lname, newRow.doctor_email, newRow.doctor_phone_number);}

    deleteIcon.class = "delete-icon"
    deleteIcon.src = "../assets/delete-icon.png"
    deleteIcon.style.width = 75 + "%";
	deleteIcon.style.height = 20 + "px"
    deleteIcon.onclick = function(){
        showDeleteSection(`${newRow.doctor_id} : ${newRow.doctor_fname} ${newRow.doctor_lname}`)
    }

    // Fill the cells with correct data
    idCell.innerText = newRow.doctor_id;
    firstNameCell.innerText = newRow.doctor_fname;
    lastNameCell.innerText = newRow.doctor_lname
    emailCell.innerText = newRow.doctor_email;
    phoneNumberCell.innerText = newRow.doctor_phone_number
    editCell.append(editIcon)
    deleteCell.append(deleteIcon)

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(emailCell);
    row.appendChild(phoneNumberCell);
    row.appendChild(editCell);
    row.appendChild(deleteCell)
    row.setAttribute('data-value', newRow.doctor_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

}
function toggleEdit(doctor_id, doctor_fname, doctor_lname, doctor_email, doctor_phone_number) { 
    let element = document.getElementById("update");
    let idInput = document.getElementById("inputDoctorIDUpdate")
    let fnameInput = document.getElementById("inputDoctorFnameUpdate")
    let lnameInput = document.getElementById("inputDoctorLnameUpdate")
    let emailInput = document.getElementById("inputDoctorEmailUpdate")
    let phoneInput = document.getElementById("inputDoctorPhoneUpdate")


    if (element.style.display === "none") { 
        idInput.value = doctor_id
        fnameInput.value = doctor_fname
        lnameInput.value = doctor_lname
        emailInput.value = doctor_email
        phoneInput.value = doctor_phone_number
        element.style.display = "block"; 
    } else {
        element.style.display = "none";
        idInput.value = ''
        fnameInput.value = ''
        lnameInput.value = ''
        emailInput.value = ''
        phoneInput.value = ''
}};
