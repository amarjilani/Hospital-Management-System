/*
    SETUP
*/

// Express
var express = require("express"); // We are using the express library for the web server
var app = express(); // We need to instantiate an express object to interact with the server in our code
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
PORT = 4014; // Set a port number at the top so it's easy to change in the future

// Database
var db = require("./database/db-connector");

// handlebars
const { engine } = require("express-handlebars");
var exphbs = require("express-handlebars"); // Import express-handlebars
app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    helpers: {
      // turns time into am/pm format; example: 09:00 AM
      timeAMPM: function (inputString) {
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
      },
    },
  })
); // Create an instance of the handlebars engine to process templates
app.set("view engine", ".hbs");

/*
    ROUTES
*/
app.get("/index", function (req, res) {
  res.render("index");
});

app.get("/doctors", function (req, res) {
  let query1;
  if (req.query.name === undefined || req.query.name === "") {
    query1 = "SELECT * FROM Doctors";
  } else {
    isFullName = req.query.name.indexOf(" ") >= 0;
    if (isFullName) {
      words = req.query.name.split(" ");
      inputFirstName = words[0];
      inputLastName = words[1];
      query1 = `SELECT * FROM Doctors WHERE LOWER(doctor_fname) LIKE LOWER("${inputFirstName}") AND LOWER(doctor_lname) LIKE LOWER("${inputLastName}")`;
    } else {
      query1 = `SELECT * FROM Doctors WHERE LOWER(doctor_fname) LIKE LOWER("${req.query.name}") OR LOWER(doctor_lname) LIKE LOWER("${req.query.name}")`;
    }
  }

  db.pool.query(query1, function (err, rows, fields) {
    res.render("doctors", { data: rows });
  });
});

app.post("/add-doctor", function (req, res) {
  let data = req.body;
  console.log(data);

  // Create the query and run it on the database
  query1 = `INSERT INTO Doctors (doctor_fname, doctor_lname, doctor_email, doctor_phone_number) VALUES ('${data.doctor_fname}', '${data.doctor_lname}', '${data.doctor_email}', '${data.doctor_phone_number}')`;
  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      let query2 = "SELECT * FROM Doctors;";
      db.pool.query(query2, function (err, rows, fields) {
        // Turn datetime to date
        res.send(rows);
      });
    }
  });
});

app.put("/update-doctor", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;
  console.log(data);
  // Create the query and run it on the database
  let query1 = `UPDATE Doctors SET doctor_fname = '${data.doctor_fname}', doctor_lname = '${data.doctor_lname}', doctor_email = '${data.doctor_email}', doctor_phone_number = '${data.doctor_phone_number}' WHERE doctor_id = ${data.doctor_id};`;
  let query2 = `SELECT * FROM Doctors WHERE doctor_id = ${data.doctor_id};`;
  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      db.pool.query(query2, function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          res.send(rows);
        }
      });
    }
  });
});

app.delete("/delete-doctor", function (req, res) {
  let data = req.body;
  let doctorId = parseInt(data.doctorId);
  let deleteDoctor = "DELETE FROM Doctors WHERE doctor_id = ?";

  db.pool.query(deleteDoctor, [doctorId], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

app.get("/patients", function (req, res) {
  let query1;
  if (req.query.name === undefined || req.query.name === "") {
    query1 = "SELECT * FROM Patients";
  } else {
    isFullName = req.query.name.indexOf(" ") >= 0;
    if (isFullName) {
      words = req.query.name.split(" ");
      inputFirstName = words[0];
      inputLastName = words[1];
      query1 = `SELECT * FROM Patients WHERE LOWER(patient_fname) LIKE LOWER("${inputFirstName}") AND LOWER(patient_lname) LIKE LOWER("${inputLastName}")`;
    } else {
      query1 = `SELECT * FROM Patients WHERE LOWER(patient_fname) LIKE LOWER("${req.query.name}") OR LOWER(patient_lname) LIKE LOWER("${req.query.name}")`;
    }
  }

  db.pool.query(query1, function (err, rows, fields) {
    res.render("patients", { data: rows });
  });
});

app.post("/add-patient", function (req, res) {
  let data = req.body;
  console.log(data);

  // Create the query and run it on the database
  let query1 = `INSERT INTO Patients (patient_fname, patient_lname, patient_age, patient_email, patient_phone_number) VALUES ('${data.patient_fname}', '${data.patient_lname}', ${data.patient_age}, '${data.patient_email}', '${data.patient_phone_number}')`;
  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      let query2 = "SELECT * FROM Patients;";
      db.pool.query(query2, function (err, rows, fields) {
        // Turn datetime to date
        res.send(rows);
      });
    }
  });
});

app.put("/update-patient", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;
  console.log(data);
  // Create the query and run it on the database
  let query1 = `UPDATE Patients SET patient_fname = '${data.patient_fname}', patient_lname = '${data.patient_lname}', patient_age = ${data.patient_age}, patient_email = '${data.patient_email}', patient_phone_number = '${data.patient_phone_number}' WHERE patient_id = ${data.patient_id};`;
  let query2 = `SELECT * FROM Patients WHERE patient_id = ${data.patient_id};`;
  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      db.pool.query(query2, function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          res.send(rows);
        }
      });
    }
  });
});

app.delete("/delete-patient", function (req, res) {
  let data = req.body;
  let patientId = parseInt(data.patientId);
  let deletePatient = "DELETE FROM Patients WHERE patient_id = ?";

  db.pool.query(deletePatient, [patientId], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

app.get("/patients_illnesses", function (req, res) {
  let query1 =
    "SELECT Patients_Illnesses.patient_illness_id, Patients_Illnesses.patient_id, Patients.patient_fname, Patients.patient_lname, Patients_Illnesses.illness_id, Illnesses.illness_name FROM Patients_Illnesses LEFT JOIN Patients ON Patients_Illnesses.patient_id = Patients.patient_id LEFT JOIN Illnesses ON Patients_Illnesses.illness_id = Illnesses.illness_id ORDER BY patient_illness_id;";
  let query2 = "SELECT * from Patients ORDER BY patient_id ASC";
  let query3 = "SELECT * from Illnesses ORDER BY illness_name ASC";
  db.pool.query(query1, function (err, rows, fields) {
    let data = rows;
    db.pool.query(query2, function (err, rows, fields) {
      let patients = rows;
      db.pool.query(query3, function (err, rows, fields) {
        let illnesses = rows;
        res.render("patients_illnesses", {
          data: data,
          patient: patients,
          illness: illnesses,
        });
      });
    });
  });
});

app.post("/add-patient-illness", function (req, res) {
  let data = req.body;
  console.log(data);

  // Create the query and run it on the database
  let query1 = `INSERT INTO Patients_Illnesses (patient_id, illness_id) VALUES ('${data.patient_id}', '${data.illness_id}')`;
  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      let query2 =
        "SELECT Patients_Illnesses.patient_illness_id, Patients_Illnesses.patient_id, Patients.patient_fname, Patients.patient_lname, Patients_Illnesses.illness_id, Illnesses.illness_name FROM Patients_Illnesses LEFT JOIN Patients ON Patients_Illnesses.patient_id = Patients.patient_id LEFT JOIN Illnesses ON Patients_Illnesses.illness_id = Illnesses.illness_id ORDER BY patient_illness_id;";

      db.pool.query(query2, function (err, rows, fields) {
        // Turn datetime to date
        res.send(rows);
      });
    }
  });
});

app.delete("/delete-patient-illness", function (req, res) {
  let data = req.body;
  let patientIllnessId = parseInt(data.patientIllnessId);
  let deletePatientIllness =
    "DELETE FROM Patients_Illnesses WHERE patient_illness_id = ?";

  db.pool.query(
    deletePatientIllness,
    [patientIllnessId],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
    }
  );
});

app.get("/appointments", function (req, res) {
  // Define our queries
  let query1 =
    "SELECT Appointments.appointment_id, Appointments.patient_id, Patients.patient_fname, Patients.patient_lname, Doctors.doctor_id, Doctors.doctor_fname, Doctors.doctor_lname, Appointments.appointment_date, TIME(Appointments.appointment_date) AS time FROM Appointments LEFT JOIN Patients ON Appointments.patient_id = Patients.patient_id LEFT JOIN Doctors ON Doctors.doctor_id = Appointments.doctor_id ORDER BY appointment_id;";
  let query2 = "SELECT * from Doctors ORDER BY doctor_fname ASC;";
  let query3 = "SELECT * from Patients ORDER BY patient_fname ASC;";

  db.pool.query(query1, function (err, rows, fields) {
    // Turn datetime to date
    for (let i = 0; i < rows.length; i++) {
      rows[i].appointment_date = new Date(
        rows[i].appointment_date
      ).toLocaleDateString();
    }
    let appointments = rows;
    db.pool.query(query2, function (err, rows, fields) {
      let doctors = rows;
      db.pool.query(query3, function (err, rows, fields) {
        let patients = rows;
        res.render("appointments", {
          data: appointments,
          doctors: doctors,
          patients: patients,
        });
      });
    });
  });
});

app.post("/add-appointment", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;
  // Capture NULL values

  let doctorID = parseInt(data.doctorID);

  if (isNaN(doctorID)) {
    doctorID = "NULL";
  }
  let datetime = data.date + " " + data.time;

  // Create the query and run it on the database
  query1 = `INSERT INTO Appointments (patient_id, doctor_id, appointment_date) VALUES (${data.patientID}, ${doctorID}, '${datetime}')`;
  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      let query2 =
        "SELECT Appointments.appointment_id, Appointments.patient_id, Patients.patient_fname, Patients.patient_lname, Doctors.doctor_id, Doctors.doctor_fname, Doctors.doctor_lname, Appointments.appointment_date, TIME(Appointments.appointment_date) AS time FROM Appointments LEFT JOIN Patients ON Appointments.patient_id = Patients.patient_id LEFT JOIN Doctors ON Doctors.doctor_id = Appointments.doctor_id ORDER BY appointment_id ASC;";

      db.pool.query(query2, function (err, rows, fields) {
        // Turn datetime to date
        for (let i = 0; i < rows.length; i++) {
          rows[i].appointment_date = new Date(
            rows[i].appointment_date
          ).toLocaleDateString();
        }
        res.send(rows);
      });
    }
  });
});

app.put("/update-appointment", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;
  // Capture NULL values

  let doctorId = parseInt(data.doctorID);

  if (isNaN(doctorId)) {
    doctorId = "NULL";
  }

  let datetime = data.date + " " + data.time;

  // Create the query and run it on the database
  let query1 = `UPDATE Appointments SET patient_id = ${data.patientID}, doctor_id = ${doctorId}, appointment_date = '${datetime}' WHERE appointment_id = ${data.appointmentID};`;
  let query2 = `SELECT Appointments.appointment_id, Appointments.patient_id, Patients.patient_fname, Patients.patient_lname, Doctors.doctor_id, Doctors.doctor_fname, Doctors.doctor_lname, Appointments.appointment_date, TIME(Appointments.appointment_date) AS time FROM Appointments LEFT JOIN Patients ON Appointments.patient_id = Patients.patient_id LEFT JOIN Doctors ON Doctors.doctor_id = Appointments.doctor_id WHERE Appointments.appointment_id = ${data.appointmentID} ORDER BY appointment_id ASC;`;
  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      db.pool.query(query2, function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          // Turn datetime to date
          for (let i = 0; i < rows.length; i++) {
            rows[i].appointment_date = new Date(
              rows[i].appointment_date
            ).toLocaleDateString();
          }
          console.log(rows);
          res.send(rows);
        }
      });
    }
  });
});

app.delete("/delete-appointment", function (req, res) {
  let data = req.body;
  let appointmentID = parseInt(data.appointmentId);
  let deleteAppointment = "DELETE FROM Appointments WHERE appointment_id = ?";
  db.pool.query(
    deleteAppointment,
    [appointmentID],
    function (error, rows, fields) {
      if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
    }
  );
});

app.get("/illnesses", function (req, res) {
  let query1;
  if (req.query.name === undefined || req.query.name === "") {
    query1 = "SELECT * FROM Illnesses";
  } else {
    query1 = `SELECT * FROM Illnesses WHERE LOWER(illness_name) LIKE LOWER("${req.query.name}")`;
  }

  db.pool.query(query1, function (err, rows, fields) {
    res.render("illnesses", { data: rows });
  });
});

app.post("/add-illness", function (req, res) {
  let data = req.body;
  console.log(data);

  // Create the query and run it on the database
  let query1 = `INSERT INTO Illnesses (illness_name, illness_description) VALUES ('${data.illness_name}', '${data.illness_description}')`;
  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      let query2 = "SELECT * FROM Illnesses;";
      db.pool.query(query2, function (err, rows, fields) {
        // Turn datetime to date
        res.send(rows);
      });
    }
  });
});

app.put("/update-illness", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;
  console.log(data);
  // Create the query and run it on the database
  let query1 = `UPDATE Illnesses SET illness_name = '${data.illness_name}', illness_description = '${data.illness_description}' WHERE illness_id = ${data.illness_id};`;
  let query2 = `SELECT * FROM Illnesses WHERE illness_id = ${data.illness_id};`;
  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      db.pool.query(query2, function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          res.send(rows);
        }
      });
    }
  });
});

app.delete("/delete-illness", function (req, res) {
  let data = req.body;
  let illnessId = parseInt(data.illnessId);
  let deleteIlness = "DELETE FROM Illnesses WHERE illness_id = ?";

  db.pool.query(deleteIlness, [illnessId], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

app.get("/treatments", function (req, res) {
  let query1;
  if (req.query.name === undefined || req.query.name === "") {
    query1 = "SELECT * FROM Treatments";
  } else {
    query1 = `SELECT * FROM Treatments WHERE LOWER(treatment_name) LIKE LOWER("${req.query.name}")`;
  }

  db.pool.query(query1, function (err, rows, fields) {
    res.render("treatments", { data: rows });
  });
});

app.post("/add-treatment", function (req, res) {
  let data = req.body;
  console.log(data);

  // Create the query and run it on the database
  let query1 = `INSERT INTO Treatments (treatment_name, treatment_description, treatment_stock) VALUES ('${data.treatment_name}', '${data.treatment_description}', ${data.treatment_stock})`;
  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      let query2 = "SELECT * FROM Treatments;";
      db.pool.query(query2, function (err, rows, fields) {
        // Turn datetime to date
        res.send(rows);
      });
    }
  });
});

app.put("/update-treatment", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;
  console.log(data);
  // Create the query and run it on the database
  let query1 = `UPDATE Treatments SET treatment_name = '${data.treatment_name}', treatment_description = '${data.treatment_description}', treatment_stock = ${data.treatment_stock} WHERE treatment_id = ${data.treatment_id};`;
  let query2 = `SELECT * FROM Treatments WHERE treatment_id = ${data.treatment_id};`;
  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      db.pool.query(query2, function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          res.send(rows);
        }
      });
    }
  });
});

app.delete("/delete-treatment", function (req, res) {
  let data = req.body;
  let treatmentId = parseInt(data.treatmentId);
  let deleteTreatment = "DELETE FROM Treatments WHERE treatment_id = ?";

  db.pool.query(deleteTreatment, [treatmentId], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

app.get("/illnesses-treatments", function (req, res) {
  let query1 =
    "SELECT Illnesses_Treatments.illness_treatment_id, Illnesses_Treatments.illness_id, Illnesses_Treatments.treatment_id, Illnesses.illness_name, Treatments.treatment_name FROM Illnesses_Treatments LEFT JOIN Illnesses ON Illnesses_Treatments.illness_id = Illnesses.illness_id LEFT JOIN Treatments ON Illnesses_Treatments.treatment_id = Treatments.treatment_id ORDER BY illness_treatment_id;";
  let query2 = "SELECT * from Illnesses ORDER BY illness_name ASC";
  let query3 = "SELECT * from Treatments ORDER BY treatment_name ASC";
  db.pool.query(query1, function (err, rows, fields) {
    let data = rows;
    db.pool.query(query2, function (err, rows, fields) {
      let illnesses = rows;
      db.pool.query(query3, function (err, rows, fields) {
        let treatments = rows;
        res.render("illnesses-treatments", {
          data: data,
          illness: illnesses,
          treatment: treatments,
        });
      });
    });
  });
});

app.post("/add-illness-treatment", function (req, res) {
  let data = req.body;
  console.log(data);

  // Create the query and run it on the database
  let query1 = `INSERT INTO Illnesses_Treatments (illness_id, treatment_id) VALUES ('${data.illness_id}', '${data.treatment_id}')`;
  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      let query2 =
        "SELECT Illnesses_Treatments.illness_treatment_id, Illnesses_Treatments.illness_id, Illnesses_Treatments.treatment_id, Illnesses.illness_name, Treatments.treatment_name FROM Illnesses_Treatments LEFT JOIN Illnesses ON Illnesses_Treatments.illness_id = Illnesses.illness_id LEFT JOIN Treatments ON Illnesses_Treatments.treatment_id = Treatments.treatment_id ORDER BY illness_treatment_id;";
      db.pool.query(query2, function (err, rows, fields) {
        // Turn datetime to date
        res.send(rows);
      });
    }
  });
});

app.delete("/delete-illness-treatment", function (req, res) {
  let data = req.body;
  let illnessTreatmentId = parseInt(data.illnessTreatmentId);
  let deleteillnessTreatment =
    "DELETE FROM Illnesses_Treatments WHERE illness_treatment_id = ?";

  db.pool.query(
    deleteillnessTreatment,
    [illnessTreatmentId],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
    }
  );
});

/*
    LISTENER
*/
app.listen(PORT, function () {
  // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
  console.log(
    "Express started on http://localhost:" +
      PORT +
      "; press Ctrl-C to terminate."
  );
});
