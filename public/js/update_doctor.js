// Get the objects we need to modify
let updateDoctorForm = document.getElementById('update-doctor');

// Modify the objects we need
updateDoctorForm.addEventListener("submit", function (e) {

    console.log(`update submitted`)
    
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


function updateRow(data, doctor_id){
    let parsedData = JSON.parse(data);
    console.log(parsedData)
    
    let table = document.getElementById("all-doctors");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == doctor_id) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let doctorFnameTd = updateRowIndex.getElementsByTagName("td")[1];
            let doctorLnameTd = updateRowIndex.getElementsByTagName("td")[2];
            let doctorEmailTd = updateRowIndex.getElementsByTagName("td")[3];
            let doctorPhoneTd = updateRowIndex.getElementsByTagName("td")[4];
            let editTd = updateRowIndex.getElementsByTagName("td")[5];
            let deleteTd = updateRowIndex.getElementsByTagName("td")[6];

            doctorFnameTd.innerHTML = parsedData[0].doctor_fname;
            doctorLnameTd.innerHTML = parsedData[0].doctor_lname;
            doctorEmailTd.innerHTML = parsedData[0].doctor_email;
            doctorPhoneTd.innerHTML = parsedData[0].doctor_phone_number;

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
                toggleEdit(parsedData[0].doctor_id, parsedData[0].doctor_fname, parsedData[0].doctor_lname, parsedData[0].doctor_email, parsedData[0].doctor_phone_number);}

            deleteIcon.onclick = function(){
                showDeleteSection(`${parsedData[0].doctor_id} : ${parsedData[0].doctor_fname} ${parsedData[0].doctor_lname}`)
            }
       }
    }
}