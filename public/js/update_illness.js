// Get the objects we need to modify
let updateIllnessForm = document.getElementById('update-illness');

// Modify the objects we need
updateIllnessForm.addEventListener("submit", function (e) {

    console.log(`update submitted`)
    
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

            // Add the new data to the table
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


function updateRow(data, illness_id){
    let parsedData = JSON.parse(data);
    console.log(parsedData)
    
    let table = document.getElementById("all-illnesses");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == illness_id) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let illnessNameTd = updateRowIndex.getElementsByTagName("td")[1];
            let illnessDescriptionTd = updateRowIndex.getElementsByTagName("td")[2];
            let editTd = updateRowIndex.getElementsByTagName("td")[3];
            let deleteTd = updateRowIndex.getElementsByTagName("td")[4];

            illnessNameTd.innerHTML = parsedData[0].illness_name;
            illnessDescriptionTd.innerHTML = parsedData[0].illness_description;

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
                toggleEdit(parsedData[0].illness_id, parsedData[0].illness_name, parsedData[0].illness_description);}

            deleteIcon.onclick = function(){
                showDeleteSection(`${parsedData[0].illness_id} : ${parsedData[0].illness_name}`)
            }
       }
    }
}