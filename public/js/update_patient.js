// Get the update Patient form 
let updatePatientForm = document.getElementById('update-patient');

// Citation for the following function:
// Date: 11/13/2022
// Based on: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// On submit, collect data from the form 
updatePatientForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let idInput    = document.getElementById("inputPatientIDUpdate")
    let fnameInput = document.getElementById("inputPatientFnameUpdate")
    let lnameInput = document.getElementById("inputPatientLnameUpdate")
    let ageInput   = document.getElementById("inputPatientAgeUpdate")
    let emailInput = document.getElementById("inputPatientEmailUpdate")
    let phoneInput = document.getElementById("inputPatientPhoneUpdate")

    // Get the values from the form fields
    let patientIdValue    = idInput.value; 
    let patientFnameValue = fnameInput.value;
    let patientLnameValue = lnameInput.value;
    let patientAgeValue   = ageInput.value;
    let patientEmailValue = emailInput.value;
    let patientPhoneValue = phoneInput.value;

    // Put our data we want to send in a javascript object
    let data = {
        patient_id:     patientIdValue,
        patient_fname:  patientFnameValue,
        patient_lname:  patientLnameValue,
        patient_age:    patientAgeValue,
        patient_email:  patientEmailValue,
        patient_phone_number: patientPhoneValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-patient", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table and hide the form 
            updateRow(xhttp.response, patientIdValue)
            toggleEdit()

            // Clear the input fields for another transaction
            idInput.value = '';
            fnameInput.value = '';
            lnameInput.value = '';
            ageInput.value   = '';
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

// function to update a specific row within the Patients table 
function updateRow(data, patient_id){
    let parsedData = JSON.parse(data);
    
    // get the Patients table 
    let table = document.getElementById("all-patients");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows to find the row that matches the updated Patient based on ID
       if (table.rows[i].getAttribute("data-value") == patient_id) {

            // get the index of the row to update 
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get all the TD elements in that row 
            let patientFnameTd = updateRowIndex.getElementsByTagName("td")[1];
            let patientLnameTd = updateRowIndex.getElementsByTagName("td")[2];
            let patientAgeTd   = updateRowIndex.getElementsByTagName("td")[3]
            let patientEmailTd = updateRowIndex.getElementsByTagName("td")[4];
            let patientPhoneTd = updateRowIndex.getElementsByTagName("td")[5];
            let editTd = updateRowIndex.getElementsByTagName("td")[6];
            let deleteTd = updateRowIndex.getElementsByTagName("td")[7];

            // fill all the TD elements with the relevant data 
            patientFnameTd.innerHTML = parsedData[0].patient_fname;
            patientLnameTd.innerHTML = parsedData[0].patient_lname;
            patientAgeTd.innerHTML   = parsedData[0].patient_age;
            patientEmailTd.innerHTML = parsedData[0].patient_email;
            patientPhoneTd.innerHTML = parsedData[0].patient_phone_number;

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
                toggleEdit(parsedData[0].patient_id, parsedData[0].patient_fname, parsedData[0].patient_lname, parsedData[0].patient_age, parsedData[0].patient_email, parsedData[0].patient_phone_number);}

            deleteIcon.onclick = function(){
                showDeleteSection(`${parsedData[0].patient_id} : ${parsedData[0].patient_fname} ${parsedData[0].patient_lname}`)
            }
       }
    }
}
