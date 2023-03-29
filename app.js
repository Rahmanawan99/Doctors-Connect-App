const con = require("./db-config/database-config");
const express = require("express");
var cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// REQUESTS
// GET - TO get all the data
// POST -  to add new data to the data
// PUT - update the already existing instance
// DELETE - To delete the data

// simply returning a message to the response.
app.get("/", (req, res) => {
  res.send("Contact App Server Started");
});

// get patients

// /patients this is endpoint, you can hit the api through this endpoint.
// req, res are two methods for accept the incomming request from the frontend and send the response to the frontend
app.get("/patients", (req, res) => {
  // con.query is a method for runnig sql queries, I write the select query here, if the query execute succesfully
  // then the result will be appear in the result parameter, if there is an error, it will appear in err arguement.
  con.query("select * from patients", (err, result) => {
    // checking here, if there is an error send the response with the code 404 and the message.
    if (err) res.statusCode(404).send(err.message);
    // if there is no error, sent the fetched result from the database to frontend.
    res.send({
      status: "success",
      data: result,
    });
  });
});

app.get("/patients/:id", (req, res) => {
  con.query(
    `select * from patients where id=${req.params.id}`,
    (err, result) => {
      if (err) res.statusCode(404).send(err.message);
      res.send({
        status: "success",
        data: result,
      });
    }
  );
});

app.post("/patients", (req, res) => {
  // here we are getting the results from the frontend in the request parameter and destruct them.
  const {
    patientName,
    email,
    password,
    age,
    gender,
    phoneNo,
    country,
    address,
  } = req.body;
  // passing that data in the sql query here.
  con.query(
    `INSERT into patients (patientName, email, password, age, gender, phoneNo, country, address) VALUES ('${patientName}', '${email}', '${password}',${age}, '${gender}','${phoneNo}','${country}','${
      address || "-"
    }')`,
    (err, result) => {
      if (err) {
        // if there is an error send the error message
        res.status(404).json({
          status: "error",
          message: err.message.includes("email")
            ? "Email already exists"
            : err.message,
        });
        res.end();
        return;
      }
      // else send the success message.
      res.send({
        status: "success",
        data: "new user added successfully",
      });
    }
  );
});

app.delete("/patients/:id", (req, res) => {
  con.query(
    `delete from patients where id = ${req.params.id}`,
    (err, result) => {
      if (err) res.statusCode(404).send(err.message);
      if (result.affectedRows > 0) {
        res.send({
          status: "success",
          data: "user delete successfully!",
        });
      } else {
        res.send({
          status: "error",
          data: "No user found",
        });
      }
    }
  );
});

app.put("/patients/:id", (req, res) => {
  const {
    patientName,
    email,
    password,
    age,
    gender,
    phoneNo,
    country,
    address,
  } = req.body;
  con.query(
    `UPDATE patients SET patientName='${patientName}', email='${email}', password='${password}', age=${age}, gender='${gender}', phoneNo='${phoneNo}', country='${country}', address='${address}' WHERE id=${req.params.id}`,
    (err, result) => {
      if (err) {
        // if there is an error send the error message
        res.status(404).json({
          status: "error",
          message: err.message.includes("email")
            ? "Email already exists"
            : err.message,
        });
        res.end();
        return;
      }

      if (result.affectedRows > 0) {
        res.send({
          status: "success",
          data: "user updated successfully",
        });
      } else {
        res.send({
          status: "error",
          data: "No user found",
        });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password, role } = req.body;
  if (role === "patient") {
    con.query(
      `select * from patients where email='${email}' and password='${password}'`,
      (err, result) => {
        if (err) res.status(404).send(err.message);
        if (result.length > 0) {
          res.send({
            status: "success",
            data: result,
          });
        } else {
          res.send({
            status: "error",
            data: "No user found",
          });
        }
      }
    );
  } else if (role === "doctor") {
    con.query(
      `select * from doctors where email='${email}' and password='${password}'`,
      (err, result) => {
        if (err) res.status(404).send(err.message);
        if (result.length > 0) {
          res.send({
            status: "success",
            data: result,
          });
        } else {
          res.send({
            status: "error",
            data: "No user found",
          });
        }
      }
    );
  }
});

app.post("/doctors", (req, res) => {
  const {
    doctorname,
    email,
    password,
    age,
    no,
    country,
    gender,
    Address,
    designation,
    workingDays,
    salary,
    education,
  } = req.body;

  con.query(
    `INSERT INTO doctors (doctorName, email, password, age, phoneNo, country, gender, address, designation, workingDays, salary, education ) VALUES ('${doctorname}', '${email}'
   ,'${password}', ${age}, '${no}', '${country}','${gender}','${Address}', '${designation}', ${workingDays}, ${salary}, '${education}')`,
    (err, result) => {
      if (err) {
        res.status(404).json({
          status: "error",
          message: err.message.includes("email")
            ? "Email already exists"
            : err.message,
        });
        return;
      }
      res.send({
        status: "success",
        data: "new doctor added successfully",
      });
    }
  );
});

app.get("/doctors", (req, res) => {
  con.query(`select * from doctors`, (err, result) => {
    if (err) res.statusCode(404).send(err.message);
    res.send({
      status: "success",
      data: result,
    });
  });
});

app.get("/doctors/:id", (req, res) => {
  con.query(
    `select * from doctors where id=${req.params.id}`,
    (err, result) => {
      if (err) res.statusCode(404).send(err.message);
      res.send({
        status: "success",
        data: result,
      });
    }
  );
});

app.put("/doctors/:id", (req, res) => {
  const {
    doctorName,
    email,
    password,
    age,
    phoneNo,
    country,
    gender,
    address,
    designation,
    workingDays,
    salary,
    education,
  } = req.body;
  con.query(
    `UPDATE doctors SET doctorName='${doctorName}', email='${email}', password='${password}', age='${age}', phoneNo='${phoneNo}', country='${country}', gender='${gender}', address='${address}', designation='${designation}', workingDays=${workingDays}, salary=${salary}, education='${education}' where id=${req.params.id}`,
    (err, result) => {
      if (err) {
        res.status(404).send(err.message);
        return;
      }

      if (result) {
        console.log(result);
        res.send({
          status: "success",
          data: "user updated successfully",
        });
      } else {
        res.send({
          status: "error",
          data: "No user found",
        });
      }
    }
  );
});

// delete doctor
app.delete("/doctors/:id", (req, res) => {
  con.query(
    `delete from doctors where id = ${req.params.id}`,
    (err, result) => {
      if (err) res.statusCode(404).send(err.message);
      if (result.affectedRows > 0) {
        res.send({
          status: "success",
          data: "user delete successfully!",
        });
      } else {
        res.send({
          status: "error",
          data: "No user found",
        });
      }
    }
  );
});

// add diseases

app.post("/diseases", (req, res) => {
  const { diseaseName, description } = req.body;

  con.query(
    `INSERT INTO diseases (diseaseName, description) VALUES ('${diseaseName}', '${description}')`,
    (err, result) => {
      if (err) {
        res.status(404).json({
          status: "error",
          message: err.message.includes("diseaseName")
            ? "This disease is already exists"
            : err.message,
        });
        return;
      }
      res.send({
        status: "success",
        data: "new disease added successfully",
      });
    }
  );
});

// get all diseases
app.get("/diseases", (req, res) => {
  con.query(`select * from diseases`, (err, result) => {
    if (err) res.statusCode(404).send(err.message);
    res.send({
      status: "success",
      data: result,
    });
  });
});

// get specific disease
app.get("/diseases/:id", (req, res) => {
  con.query(
    `select * from diseases where id=${req.params.id}`,
    (err, result) => {
      if (err) res.statusCode(404).send(err.message);
      res.send({
        status: "success",
        data: result,
      });
    }
  );
});

// delete disease
app.delete("/diseases/:id", (req, res) => {
  con.query(
    `delete from diseases where id = ${req.params.id}`,
    (err, result) => {
      if (err) res.statusCode(404).send(err.message);
      if (result.affectedRows > 0) {
        res.send({
          status: "success",
          data: "disease delete successfully!",
        });
      } else {
        res.send({
          status: "error",
          data: "No disease found",
        });
      }
    }
  );
});

//problems

app.post("/patient/problem", (req, res) => {
  const { name, phoneNo, problem, askWith, askWithEmail } = req.body;
  con.query(
    `INSERT INTO problems (id,name, phoneNo, problem, askWith, askWithEmail, createdAt) VALUES (NULL,'${name}', '${phoneNo}', '${problem}', '${askWith}', '${askWithEmail}', '${new Date().toISOString()}') `,
    (err, result) => {
      if (err) {
        res.status(404).json({
          status: "error",
          message: err.message,
        });
        return;
      }
      res.send({
        status: "success",
        data: "Your problem added successfully",
      });
    }
  );
});

app.get("/patient/problem", (req, res) => {
  con.query(`SELECT * FROM problems;`, (err, result) => {
    if (err) {
      res.status(404).json({
        status: "error",
        message: err.message,
      });
      return;
    }
    res.send({
      status: "success",
      data: result,
    });
  });
});

app.get("/doctor/problems", (req, res) => {
  con.query(
    `SELECT * FROM problems where askWithEmail='${req.query.doctorEmail}';`,
    (err, result) => {
      if (err) {
        res.status(404).json({
          status: "error",
          message: err.message,
        });
        return;
      }
      res.send({
        status: "success",
        data: result,
      });
    }
  );
});

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
