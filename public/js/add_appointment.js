
// Get the add Appointments form 
let addAppointmentForm = document.getElementById('add-appointment');

// Citation for the following function:
// Date: 11/13/2022
// Based on: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// On submit, collect data from form 
addAppointmentForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPatientID = document.getElementById("inputPatientID");
    let inputDoctorID = document.getElementById("inputDoctorID");
    let inputDate = document.getElementById("inputDate");
    let inputTime = document.getElementById("inputTime");

    // Get the values from the form fields
    let patientIDValue = inputPatientID.value;
    let doctorIDValue = inputDoctorID.value;
    let dateValue = inputDate.value;
    let timeValue = inputTime.value;

    // Put our data we want to send in a javascript object
    let data = {
        patientID: patientIDValue,
        doctorID: doctorIDValue,
        date: dateValue,
        time: timeValue
    }
    
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-appointment", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputPatientID.value = '';
            inputDoctorID.value = '';
            inputDate.value = '';
            inputTime.value = '';
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

// Creates a new row in the Appointments table using the passed data 
addRowToTable = (data) => {

    // Get a reference to the current table on the page
    let currentTable = document.getElementById("all-appointments");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and all the cells needed for that row 
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let patientIDCell = document.createElement("TD");
    let patientNameCell = document.createElement("TD");
    let doctorIDCell = document.createElement("TD");
    let doctorNameCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let timeCell = document.createElement("TD");
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
        toggleEdit(newRow.appointment_id, newRow.patient_id, newRow.doctor_id, newRow.appointment_date, newRow.time);}
    
    // create delete icon 
    deleteIcon.class = "delete-icon"
    deleteIcon.src = "../assets/delete-icon.png"
    deleteIcon.style.width = 75 + "%";
	deleteIcon.style.height = 20 + "px"
    // pass data to showDeleteSection function to display correct information on delete form 
    deleteIcon.onclick = function(){
        showDeleteSection(
          newRow.doctor_fname
            ? `${newRow.appointment_id} ${newRow.patient_fname} ${
                newRow.patient_lname
              } with Dr. ${newRow.doctor_fname} ${newRow.doctor_lname} on ${
                newRow.appointment_date
              } at ${timeAMPM(newRow.time)}`
            : `${newRow.appointment_id} ${newRow.patient_fname} ${
                newRow.patient_lname
              } on ${
                newRow.appointment_date
              } at ${timeAMPM(newRow.time)}`
        );
    }

    // Fill the cells with the data 
    idCell.innerText = newRow.appointment_id;
    patientIDCell.innerText = newRow.patient_id;
    patientNameCell.innerText = newRow.patient_fname + " " + newRow.patient_lname;  // combines first and last name into one cell 
    doctorIDCell.innerText = newRow.doctor_id;
    
    // if the doctor is null, then leave the cell empty
    if (newRow.doctor_fname == null) {
        doctorNameCell.innerText = ""
    } else {
        doctorNameCell.innerText = newRow.doctor_fname + " " + newRow.doctor_lname
    }

    dateCell.innerText = newRow.appointment_date;
    timeCell.innerText = timeAMPM(newRow.time);
    editCell.append(editIcon)
    deleteCell.append(deleteIcon)

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(patientIDCell);
    row.appendChild(patientNameCell);
    row.appendChild(doctorIDCell);
    row.appendChild(doctorNameCell);
    row.appendChild(dateCell);
    row.appendChild(timeCell);
    row.appendChild(editCell);
    row.appendChild(deleteCell)
    // set the value of the row as the appointment_id 
    row.setAttribute('data-value', newRow.appointment_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

}

// function to display/hide edit form when the edit icon is clicked
function toggleEdit(appointment_id, patient_id, doctor_id, date, time) { 

    // formats the date to match the rest of the table 
    let dateFormatted = new Date(date).toLocaleDateString("fr-CA")

    // get the update form and all the fields within it
    let element = document.getElementById("update");
    let appointmentSelect = document.getElementById("inputAppointmentID")
    let patientSelect = document.getElementById("inputPatientIDUpdate")
    let doctorSelect = document.getElementById("inputDoctorIDUpdate")
    let dateSelect = document.getElementById("inputDateUpdate")
    let timeSelect = document.getElementById("inputTimeUpdate")

    // if it is currently not displayed, fill all the fields with the passed data and display the form 
    if (element.style.display === "none") { 
        appointmentSelect.value = appointment_id
        patientSelect.value = patient_id 
        doctorSelect.value = doctor_id
        dateSelect.value = dateFormatted
        timeSelect.value = time
        element.style.display = "block"; 
    } else {
    // otherwise hide the form and clear all the fields 
        element.style.display = "none";
        inputAppointmentID.value = '';
        inputPatientID.value = '';
        inputDoctorID.value = '';
        inputDate.value = '';
        inputTime.value = '';
}};

// function to convert 24hr time to 12hr time 
function timeAMPM(inputString) {
    var trimmedString = String(inputString).slice(0, 5);
    let hour = parseInt(trimmedString.slice(0, 2));
    let remainingString = trimmedString.slice(2);
    let outputStr;

    if (hour == 0) {
        outputStr = "12" + remainingString + " AM";
    } else if (hour > 0 && hour < 10) {
        outputStr = trimmedString.substring(1) + " AM";
    } else if (hour >= 10 && hour < 12) {
        outputStr = trimmedString + " AM";
    } else if (hour == 12) {
        outputStr = trimmedString + " PM";
    } else if (hour > 12) {
        outputStr = (hour - 12).toString() + remainingString + " PM";
    }
    return outputStr;
}
