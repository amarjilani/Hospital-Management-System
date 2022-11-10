/*
    SETUP
*/
    

// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('./public'));
PORT        = 4014;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

// handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({
    extname: ".hbs",
    helpers:{
        trimString : function (inputString, start, end) {
            var trimmed = String(inputString).slice(start,end);
            return trimmed
        }
    }}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');     

/*
    ROUTES
*/
app.get('/doctors', function(req, res){
    res.render('doctors');
})

app.get('/patients', function(req, res){
    res.render('patients');
})

app.get('/illnesses', function(req, res){
    res.render('illnesses');
})

app.get('/treatments', function(req, res){
    res.render('treatments');
})

app.get('/index', function(req, res){
    res.render('index');
})

app.get('/patients_illnesses', function(req, res){
    res.render('patients_illnesses');
})

app.get('/illnesses-treatments', function(req, res){
    res.render('illnesses-treatments');
})

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
    let appointments = rows
    db.pool.query(query2, function(err, rows, fields){
        let doctors = rows;
        db.pool.query(query3, function(err, rows, fields){
            let patients = rows;
            res.render("appointments", { data: appointments, doctors:doctors, patients:patients});
        })
    })
    
});
});

app.post('/add-appointment', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    // Capture NULL values

    let doctorID = parseInt(data.doctorID);

    if (isNaN(doctorID))
    {
        doctorID = 'NULL'
    }
    let datetime = data.date + " " + data.time


    // Create the query and run it on the database
    query1 = `INSERT INTO Appointments (patient_id, doctor_id, appointment_date) VALUES (${data.patientID}, ${doctorID}, '${datetime}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            let query2 =
                    "SELECT Appointments.appointment_id, Appointments.patient_id, Patients.patient_fname, Patients.patient_lname, Doctors.doctor_id, Doctors.doctor_fname, Doctors.doctor_lname, Appointments.appointment_date, TIME(Appointments.appointment_date) AS time FROM Appointments LEFT JOIN Patients ON Appointments.patient_id = Patients.patient_id LEFT JOIN Doctors ON Doctors.doctor_id = Appointments.doctor_id ORDER BY appointment_id ASC;";

            db.pool.query(query2, function (err, rows, fields) {
                // Turn datetime to date
                for (let i = 0; i < rows.length; i++) {
                rows[i].appointment_date = new Date(
                    rows[i].appointment_date
                ).toLocaleDateString();
                }
                console.log(rows)
                res.send(rows);
            });
        }
    })
});

app.put('/update-appointment', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data)
    // Capture NULL values

    let doctorId = parseInt(data.doctorID);

    if (isNaN(doctorId))
    {
        doctorId = 'NULL'
    }

    let datetime = data.date + " " + data.time


    // Create the query and run it on the database
    let query1 = `UPDATE Appointments SET patient_id = ${data.patientID}, doctor_id = ${doctorId}, appointment_date = '${datetime}' WHERE appointment_id = ${data.appointmentID};`
    let query2 = `SELECT Appointments.appointment_id, Appointments.patient_id, Patients.patient_fname, Patients.patient_lname, Doctors.doctor_id, Doctors.doctor_fname, Doctors.doctor_lname, Appointments.appointment_date, TIME(Appointments.appointment_date) AS time FROM Appointments LEFT JOIN Patients ON Appointments.patient_id = Patients.patient_id LEFT JOIN Doctors ON Doctors.doctor_id = Appointments.doctor_id WHERE Appointments.appointment_id = ${data.appointmentID} ORDER BY appointment_id ASC;`
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error)
                    res.sendStatus(400);
                } else {
                    // Turn datetime to date
                    for (let i = 0; i < rows.length; i++) {
                    rows[i].appointment_date = new Date(
                        rows[i].appointment_date
                    ).toLocaleDateString();
                    }
                    console.log(rows)
                    res.send(rows)
                }
            })
        }
    })
});

app.delete("/delete-appointment", function (req, res) {
    let data = req.body;
    let appointmentID = parseInt(data.appointmentId);
    let deleteAppointment = "DELETE FROM Appointments WHERE appointment_id = ?";
    // Run the 1st query
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

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});