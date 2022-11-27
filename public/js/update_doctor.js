// Get the update Doctor form 
let updateDoctorForm = document.getElementById('update-doctor');

// Citation for the following function:
// Date: 11/13/2022
// Based on: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data


// On submit, collect data from the form 
updateDoctorForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let idInput = document.getElementById("inputDoctorIDUpdate")
    let fnameInput = document.getElementById("inputDoctorFnameUpdate")
    let lnameInput = document.getElementById("inputDoctorLnameUpdate")
    let emailInput = document.getElementById("inputDoctorEmailUpdate")
    let phoneInput = document.getElementById("inputDoctorPhoneUpdate")

    // Get the values from the form fields
    let doctorIdValue = idInput.value; 
    let doctorFnameValue = fnameInput.value;
    let doctorLnameValue = lnameInput.value;
    let doctorEmailValue = emailInput.value;
    let doctorPhoneValue = phoneInput.value;

    // Put our data we want to send in a javascript object
    let data = {
        doctor_id: doctorIdValue,
        doctor_fname: doctorFnameValue,
        doctor_lname: doctorLnameValue,
        doctor_email: doctorEmailValue,
        doctor_phone_number: doctorPhoneValue
    }
    
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-doctor", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, doctorIdValue)
            toggleEdit()

            // Clear the input fields for another transaction
            idInput.value = '';
            fnameInput.value = '';
            lnameInput.value = '';
            emailInput.value = '';
            phoneInput.value = '';
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

// function to update a specific row within the Doctors table 
function updateRow(data, doctor_id){
    let parsedData = JSON.parse(data);

    // get the Doctors table 
    let table = document.getElementById("all-doctors");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows and find the row that matches the updated Doctor based on ID 
       if (table.rows[i].getAttribute("data-value") == doctor_id) {

            // get the index of that row 
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // get all the TD elements of that row 
            let doctorFnameTd = updateRowIndex.getElementsByTagName("td")[1];
            let doctorLnameTd = updateRowIndex.getElementsByTagName("td")[2];
            let doctorEmailTd = updateRowIndex.getElementsByTagName("td")[3];
            let doctorPhoneTd = updateRowIndex.getElementsByTagName("td")[4];
            let editTd = updateRowIndex.getElementsByTagName("td")[5];
            let deleteTd = updateRowIndex.getElementsByTagName("td")[6];

            // fill all the TD elements with the relevant data 
            doctorFnameTd.innerHTML = parsedData[0].doctor_fname;
            doctorLnameTd.innerHTML = parsedData[0].doctor_lname;
            doctorEmailTd.innerHTML = parsedData[0].doctor_email;
            doctorPhoneTd.innerHTML = parsedData[0].doctor_phone_number;

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
                toggleEdit(parsedData[0].doctor_id, parsedData[0].doctor_fname, parsedData[0].doctor_lname, parsedData[0].doctor_email, parsedData[0].doctor_phone_number);}

            deleteIcon.onclick = function(){
                showDeleteSection(`${parsedData[0].doctor_id} : ${parsedData[0].doctor_fname} ${parsedData[0].doctor_lname}`)
            }
       }
    }
}