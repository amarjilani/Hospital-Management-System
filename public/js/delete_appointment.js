let deleteAppointmentForm = document.getElementById("deleteAppointmentForm");

// Citation for the following function:
// Date: 11/10/2022
// Based on:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data
deleteAppointmentForm.addEventListener("submit", function (e) {
  // prevent the form from submitting
  e.preventDefault();

  let inputAppointmentId = document.getElementById("created-input").value;
  let data = {
    appointmentId: inputAppointmentId,
  };

  // setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-appointment", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 204) {
      deleteRow(inputAppointmentId);
    }
  };

  // send the request and wait for the response
  xhttp.send(JSON.stringify(data));
});

// Citation for the following function:
// Date: 11/10/2022
// Based on:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data
function deleteRow(appointmentId) {
  // delete row from table and hide the delete section
  let table = document.getElementById("all-appointments");
  for (let i = 0, row; (row = table.rows[i]); i++) {
    if (table.rows[i].getAttribute("data-value") === appointmentId) {
      table.deleteRow(i);
      hideDeleteSection();
      break;
    }
  }
}

// remove the labels and input to hide the delete section
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

// create labels and input to show the delete section
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
    // disable input so user cannot change the value
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
