// Get the objects we need to modify
let deleteAppointmentForm = document.getElementById("deleteAppointmentForm");

deleteAppointmentForm.addEventListener("submit", function (e) {
  // Prevent the form from submitting
  e.preventDefault();

  let inputAppointmentId = document.getElementById("created-input").value;

  let data = {
    appointmentId: inputAppointmentId,
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-appointment", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 204) {
      deleteRow(inputAppointmentId);
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
});

function deleteRow(appointmentId) {
  let table = document.getElementById("all-appointments");
  console.log(table);
  for (let i = 0, row; (row = table.rows[i]); i++) {
    if (table.rows[i].getAttribute("data-value") === appointmentId) {
      table.deleteRow(i);
      hideDeleteSection();
      deleteDropDownMenu(appointmentId)
      break;
    }
  }
}

function hideDeleteSection() {
  let element = document.getElementById("delete");
  if (element.style.display === "block") {
    let oldFirstLabel = document.getElementById("created-label1");
    oldFirstLabel.remove();
    let oldInput = document.getElementById("created-input");
    oldInput.remove();
    let oldSecondLabel = document.getElementById("created-label2");
    oldSecondLabel.remove();
    element.style.display = "none";
  }
}

function showDeleteSection(message) {
  let element = document.getElementById("delete");
  if (element.style.display === "none") {
    const [id, ...rest] = message.split(" ");
    restOfMessage = rest.join(" ");

    var fields = document.getElementById("delete-fieldset");
    var firstCreatedLabel = document.createElement("Label");
    firstCreatedLabel.id = "created-label1";
    firstCreatedLabel.innerHTML = `ID: `;
    fields.appendChild(firstCreatedLabel);

    var newInput = document.createElement("input");
    newInput.id = "created-input";
    newInput.type = "text";
    newInput.name = "id";
    newInput.disabled = true;
    newInput.value = id;
    newInput.style.width = "30px";
    newInput.style.backgroundColor = "#ccffff";
    newInput.style.borderColor = "#ccffff";
    newInput.style.marginRight = "2px";
    fields.appendChild(newInput);

    var secondCreatedlabel = document.createElement("Label");
    secondCreatedlabel.id = "created-label2";
    secondCreatedlabel.innerHTML = restOfMessage;
    fields.appendChild(secondCreatedlabel);

    element.style.display = "block";
  }
}

function deleteDropDownMenu(appointmentID){
  let selectMenu = document.getElementById("inputAppointmentID");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(appointmentID)){
      selectMenu[i].remove();
      break;
    } 

  }
}