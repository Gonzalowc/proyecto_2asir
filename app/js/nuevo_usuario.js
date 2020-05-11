//asignar rol

connection.connect((err) => {
  if (err) {
    return console.log(err.stack);
  }
  console.log("connection succesfully established");
});
$queryString = "SELECT idrol, rol FROM rol";

connection.query($queryString, (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
  var i= sessionStorage.getItem("idrol");
  if(i == 1){
    i= 0;
  }
  if(i == 2){
    i = 1;
  }
  
  console.log(i);
  let rol = "";
  for (i; i < results.length; i++) {
    console.log(results[i].rol+" - "+results[i].idrol)
    rol +=
      '<option value="' +
      results[i].idrol +
      '">' +
      results[i].rol +
      "</option>";
  }
  document.getElementById("rol").innerHTML = rol;
});

//=================Registrar==============================
document.querySelector("#submit").onclick = function (e) {
  e.preventDefault();
  var name = document.getElementById("nombre").value;
  document.getElementById("nombre").value = "";
  var correo = document.getElementById("correo").value;
  document.getElementById("correo").value = "";
  var usuario = document.getElementById("usuario").value;
  document.getElementById("usuario").value = "";
  var clave = document.getElementById("clave").value;
  var codePass = md5(clave);
  document.getElementById("clave").value = "";
  var rol = document.getElementById("rol").value;
  var jefe = sessionStorage.getItem("idusuario");
  const alertRegister = document.getElementById("alert");
  var validateEmail = fntEmailValidate(correo);
  var datenow = Date.now();
  if (name == "") {
    var usuario = "user" + datenow;
  }

  
  console.log(name + " " + correo + " " + usuario + " " + clave + " " + rol);

  if (name == "" || correo == "" || codePass == "" || !validateEmail) {
    alertRegister.innerHTML =
      '<b><p style="color: red;">Todos los datos son obligatorios</p></b>';
    alertRegister.style.display = "block";
  } else {
    alertRegister.style.display = "none";
    alertRegister.innerHTML =
      '<b><p style="color: green;">Usuario Añadido Correctamente</p></b>';
    alertRegister.style.display = "block";
    //=====================================================================
    //==============================Consulta registrar==========================MySQL===============

    $queryString =
      "INSERT INTO usuario (nombre, correo, usuario,Jefe, clave, rol) VALUES (?,?,?,?,?,?)";

    connection.query(
      $queryString,
      [name, correo, usuario, jefe, codePass, rol],
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
                `INSERT INTO usuario (nombre, correo, usuario,Jefe, clave,rol) VALUES (?,?,?,?,?,?)`,
                [name, correo, usuario, jefe, codePass, rol],
                (err) => {
                  if (err) {
                    return console.error(err.message);
                  }
                }
              );
              console.log("Usuario añadido SQlite3");
            });
          }
        ); */
      }
    );
    /* connection.end(); */
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