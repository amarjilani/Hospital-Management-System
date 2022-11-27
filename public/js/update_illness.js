// Get the update Illness form 
let updateIllnessForm = document.getElementById('update-illness');

// Citation for the following function:
// Date: 11/13/2022
// Based on: 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// On submit, collect data from the form 
updateIllnessForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let idInput    = document.getElementById("inputIllnessIDUpdate")
    let nameInput = document.getElementById("inputIllnessNameUpdate")
    let descriptionInput = document.getElementById("inputIllnessDescriptionUpdate")

    // Get the values from the form fields
    let illnessIdValue    = idInput.value; 
    let illnessNameValue = nameInput.value;
    let illnessDescriptionValue = descriptionInput.value;

    // Put our data we want to send in a javascript object
    let data = {
        illness_id:     illnessIdValue,
        illness_name:  illnessNameValue,
        illness_description:  illnessDescriptionValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-illness", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table and hide the form 
            updateRow(xhttp.response, illnessIdValue)
            toggleEdit()

            // Clear the input fields for another transaction
            idInput.value = '';
            nameInput.value = '';
            descriptionInput.value = '';
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

// function to update specific row within the Illnesses table 
function updateRow(data, illness_id){
    let parsedData = JSON.parse(data);

    // gets the Illnesses table 
    let table = document.getElementById("all-illnesses");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows to find the row that matches the updated Illness based on its ID 
       if (table.rows[i].getAttribute("data-value") == illness_id) {

            // get the index of the row to update 
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get all the TD elements in that row 
            let illnessNameTd = updateRowIndex.getElementsByTagName("td")[1];
            let illnessDescriptionTd = updateRowIndex.getElementsByTagName("td")[2];
            let editTd = updateRowIndex.getElementsByTagName("td")[3];
            let deleteTd = updateRowIndex.getElementsByTagName("td")[4];

            // fill all the TD elements with the relevant data 
            illnessNameTd.innerHTML = parsedData[0].illness_name;
            illnessDescriptionTd.innerHTML = parsedData[0].illness_description;

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
                toggleEdit(parsedData[0].illness_id, parsedData[0].illness_name, parsedData[0].illness_description);}

            deleteIcon.onclick = function(){
                showDeleteSection(`${parsedData[0].illness_id} : ${parsedData[0].illness_name}`)
            }
       }
    }
}