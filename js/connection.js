//Require sqlite3
/* var sqlite3 = require("sqlite3").verbose();
var path = require("path"); */
//require MySQL
var mysql = require("mysql");
//===================================================
/* ar db = new sqlite3.Database('./app/db/facture.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  db.serialize(() => {
      db.each(`SELECT correo as correo,
                      clave as clave
               FROM usuario`, (err, row) => {
        if (err) {
          console.error(err.message);
        }
        console.log(row.correo + "\t" + row.clave);
      });
    });
}); */
//===================================================

var connection = mysql.createConnection({
  host: "79.145.85.205",
  port: "37182",
  user: "gonzalo",
  password: "123gonzalo123",
  database: "factura",
});
//Hash password
var md5 = require("md5");
//················································
/* var db = new sqlite3.Database('./app/db/facture.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    db.serialize(() => {
        db.each(`SELECT correo as correo,
                        clave as clave
                 FROM usuario`, (err, row) => {
          if (err) {
            console.error(err.message);
          }
          console.log(row.correo + "\t" + row.clave);
        });
      });
  }); */

//====================Inicio sesion=================
document.querySelector("#btnLogin").onclick = function () {
  const strEmailUser = document.querySelector("#emailUser").value;
  const strPassUser = document.querySelector("#passUser").value;
  const alertPass = document.querySelector("#alertPass");
  var codePass = md5(strPassUser);
  //==localstorage====
  function guardar_sessionStorage() {
    var user = strEmailUser;
    sessionStorage.setItem("correo", user);
  }
  if (strPassUser == "" || strEmailUser == "") {
    alertPass.innerHTML = '<p style="color: red;">Escriba su contraseña.</p>';
    alertPass.style.display = "block";
  }
  alertPass.style.display = "none";
  //===================Consulta sesion=====================MySQL=====================
  connection.connect((err) => {
    if (err) {
      alertPass.innerHTML = '<p style="color: red;">Compruebe su conexión o Registrese';
      alertPass.style.display ="block";
      return console.log(err.stack);
    }
    console.log("connection succesfully established");
  });
  $queryString =
    "SELECT correo, clave FROM usuario WHERE correo = ? AND clave = ? and estatus=1";

  connection.query($queryString, [strEmailUser, codePass], (err, rows) => {
    if (err) {

      return console.log("An error ocurred with the query", err);
    }
    if (rows.length > 0) {
      rows.forEach((row) => {
        if (row.correo == strEmailUser && row.clave == codePass) {
          //=============LocalStorage=============================MySQL==============
          guardar_sessionStorage();

          //=============final localStorage===============
          window.location = "./app/index.html";
          connection.end(() => {
            console.log("connection succesfully closed");
          });
        } else {
          console.log("Usuario o contraseña errónea");
        }
      });
    } else {
      alertPass.innerHTML =
        '<p style="color: red;">Usuario o Contraseña errónea</p>';
      alertPass.style.display = "block";
    }
  });

  connection.end(() => {
    console.log("connection succesfully closed");
  });
  //==================
};

//==========================Registrar ====================================================================================
document.querySelector("#btnRegister").onclick = function () {
  const nameUser = document.querySelector("#nameUser").value;
  document.querySelector("#nameUser").value = "";
  const emailNewUser = document.querySelector("#emailNewUser").value;
  document.querySelector("#emailNewUser").value = "";
  var validateEmail = fntEmailValidate(emailNewUser);
  const passNewUser = document.querySelector("#passNewUser").value;
  document.querySelector("#passNewUser").value = "";
  const alertRegister = document.querySelector("#alertRegister");
  var datenow = Date.now();
  var name = "user" + datenow;
  var codePass = md5(passNewUser);

  if (
    nameUser == "" ||
    emailNewUser == "" ||
    codePass == "" ||
    !validateEmail
  ) {
    alertRegister.innerHTML =
      '<p style="color: red;">Todos los datos son obligatorios</p>';
    alertRegister.style.display = "block";
  } else {
    alertRegister.style.display = "none";

    //=====================================================================
    //==============================Consulta registrar==========================MySQL===============

    connection.connect((err) => {
      if (err) {
        return console.log(err.stack);
      }
      console.log("connection succesfully established");
    });
    $queryString =
      "INSERT INTO usuario (nombre, correo, usuario, clave) VALUES (?,?,?,?)";

    connection.query(
      $queryString,
      [nameUser, emailNewUser, name, codePass],
      (err, rows, fields) => {
        if (err) {
          return console.log("An error ocurred with the query MySQL", err);
        }
        console.log("Usuario añadido MySQL");
        //===========================consulta registrar=========================SQLITE3=================
        /* var db = new sqlite3.Database(
          "./app/db/facture.db",
          sqlite3.OPEN_READWRITE,
          (err) => {
            if (err) {
              console.error(err.message);
            }
            db.serialize(() => {
              db.each(
                `INSERT INTO usuario (nombre, correo, usuario, clave) VALUES (?,?,?,?)`,
                [nameUser, emailNewUser, name, codePass],
                (err) => {
                  if (err) {
                    return console.error(err.message);
                  }
                }
              );
              return console.log("Usuario añadido SQlite3");
            });
          }
        ); */
      }
    );
    //=====================================================================
  }
};

//validate Email
function fntEmailValidate(email) {
  const stringEmail = new RegExp(
    /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9])+\.)+([a-zA-Z0-9]{2,4})+$/
  );
  if (stringEmail.test(email) == false) {
    return false;
  } else {
    return true;
  }
}
