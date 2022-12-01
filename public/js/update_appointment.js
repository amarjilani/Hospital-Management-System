// Get the update Appointment form 
let updateAppointmentForm = document.getElementById('update-appointment');

// Citation for the following function:
// Date: 11/13/2022
// Based on: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// On submit, collect data from the form 
updateAppointmentForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputAppointmentID = document.getElementById("inputAppointmentID")
    let inputPatientID = document.getElementById("inputPatientIDUpdate");
    let inputDoctorID = document.getElementById("inputDoctorIDUpdate");
    let inputDate = document.getElementById("inputDateUpdate");
    let inputTime = document.getElementById("inputTimeUpdate");

    // Get the values from the form fields
    let appointmentIDValue = inputAppointmentID.value;
    let patientIDValue = inputPatientID.value;
    let doctorIDValue = inputDoctorID.value;
    let dateValue = inputDate.value;
    let timeValue = inputTime.value;

    // Put our data we want to send in a javascript object
    let data = {
        appointmentID: appointmentIDValue,
        patientID: patientIDValue,
        doctorID: doctorIDValue,
        date: dateValue,
        time: timeValue
    }
    
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-appointment", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table and hide the form 
            updateRow(xhttp.response, appointmentIDValue)
            toggleEdit()

            // Clear the input fields for another transaction
            inputAppointmentID.value = '';
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
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// function to update a specific row within the Appointments table 
function updateRow(data, appointment_id){
    let parsedData = JSON.parse(data);
    
    // gets the Appointments table 
    let table = document.getElementById("all-appointments");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows to find the row that matches the updated Appointment based on ID
       if (table.rows[i].getAttribute("data-value") == appointment_id) {

            // get the index of the row to update 
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // get all the TD elements in that row 
            let patientIdTd = updateRowIndex.getElementsByTagName("td")[1];
            let patientNameTd = updateRowIndex.getElementsByTagName("td")[2];
            let doctorIdTd = updateRowIndex.getElementsByTagName("td")[3];
            let doctorNameTd = updateRowIndex.getElementsByTagName("td")[4];
            let dateTd = updateRowIndex.getElementsByTagName("td")[5];
            let timeTd = updateRowIndex.getElementsByTagName("td")[6];
            let editTd = updateRowIndex.getElementsByTagName("td")[7];
            let deleteTd = updateRowIndex.getElementsByTagName("td")[8];

            // fill all the TD elements with the relevant data 
            patientIdTd.innerHTML = parsedData[0].patient_id;
            patientNameTd.innerHTML = parsedData[0].patient_fname + " " + parsedData[0].patient_lname
            doctorIdTd.innerHTML = parsedData[0].doctor_id;
            // leave the doctor cell blank if the doctor is null 
            if (parsedData[0].doctor_fname == null){
                doctorNameTd.innerHTML = ""
            } else{
            doctorNameTd.innerHTML = parsedData[0].doctor_fname + " " + parsedData[0].doctor_lname;
            }
            dateTd.innerHTML = parsedData[0].appointment_date;
            timeTd.innerHTML = timeAMPM(parsedData[0].time);

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
                toggleEdit(parsedData[0].appointment_id, parsedData[0].patient_id, parsedData[0].doctor_id, parsedData[0].appointment_date, parsedData[0].time);}

            deleteIcon.onclick = function(){
              showDeleteSection(
                parsedData[0].doctor_fname
                  ? `${parsedData[0].appointment_id} ${parsedData[0].patient_fname} ${
                    parsedData[0].patient_lname
                    } with Dr. ${parsedData[0].doctor_fname} ${parsedData[0].doctor_lname} on ${
                      parsedData[0].appointment_date
                    } at ${timeAMPM(parsedData[0].time)}`
                  : `${parsedData[0].appointment_id} ${parsedData[0].patient_fname} ${
                    parsedData[0].patient_lname
                    } on ${
                      parsedData[0].appointment_date
                    } at ${timeAMPM(parsedData[0].time)}`
              );
          }
       }
    }
}

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