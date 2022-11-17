// Get the objects we need to modify
let updateAppointmentForm = document.getElementById('update-appointment');

// Modify the objects we need
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

            // Add the new data to the table
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


function updateRow(data, appointment_id){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("all-appointments");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == appointment_id) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let patientIdTd = updateRowIndex.getElementsByTagName("td")[1];
            let patientNameTd = updateRowIndex.getElementsByTagName("td")[2];
            let doctorIdTd = updateRowIndex.getElementsByTagName("td")[3];
            let doctorNameTd = updateRowIndex.getElementsByTagName("td")[4];
            let dateTd = updateRowIndex.getElementsByTagName("td")[5];
            let timeTd = updateRowIndex.getElementsByTagName("td")[6];
            let editTd = updateRowIndex.getElementsByTagName("td")[7];
            let deleteTd = updateRowIndex.getElementsByTagName("td")[8];

            patientIdTd.innerHTML = parsedData[0].patient_id;
            patientNameTd.innerHTML = parsedData[0].patient_fname + " " + parsedData[0].patient_lname
            doctorIdTd.innerHTML = parsedData[0].doctor_id;
            if (parsedData[0].doctor_fname == null){
                doctorNameTd.innerHTML = ""
            } else{
            doctorNameTd.innerHTML = parsedData[0].doctor_fname + " " + parsedData[0].doctor_lname;
            }
            dateTd.innerHTML = parsedData[0].appointment_date;
            timeTd.innerHTML = timeAMPM(parsedData[0].time);

            let editIcon; 
            let deleteIcon; 
            
            for (let child of editTd.children) {
                if (child.class = "edit-icon"){
                editIcon = child 
            }}

            for (let child of deleteTd.children) {
                if (child.class = "delete-icon"){
                deleteIcon = child 
            }}

            editIcon.onclick = function(){
                toggleEdit(parsedData[0].appointment_id, parsedData[0].patient_id, parsedData[0].doctor_id, parsedData[0].appointment_date, parsedData[0].time);}

            deleteIcon.onclick = function(){
                showDeleteSection(`${parsedData[0].appointment_id} ${parsedData[0].patient_fname} ${parsedData[0].patient_lname} with Dr. ${parsedData[0].doctor_fname} ${parsedData[0].doctor_lname} on ${parsedData[0].appointment_date} at ${timeAMPM(parsedData[0].time)}`)
            }
       }
    }
}

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