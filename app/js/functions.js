//Require sqlite3
/* var sqlite3 = require("sqlite3").verbose();
var path = require("path"); */
//require MySQL
var mysql = require("mysql");
//Hash password
var md5 = require("md5");
//require jquery datatable
var $ = require("jquery");
var dt = require("datatables.net")(window, $);
var ip = "79.145.85.205";
//var ip = "localhost";
var Uimg ="http://"+ip+"/proyecto/img/profiles/";
var connection = mysql.createConnection({
  host: ip,
  port: "37182",
  user: "gonzalo",
  password: "123gonzalo123",
  database: "factura",
});

//················································
//Pais
$.getJSON('http://api.wipmania.com/jsonp?callback=?', function (data) {
    document.getElementById("pais").innerHTML = data.address.country + " ";
});

//===============sessionStorage======functions==========

if (
  sessionStorage.getItem("usuario") == null ||
  sessionStorage.getItem("rol") == null ||
  sessionStorage.getItem("idusuario") == null
) {
  connection.connect((err) => {
    if (err) {
      return console.log(err.stack);
    }
    console.log("connection succesfully established");
  });
  var emailUser = sessionStorage.getItem("correo");
  $queryString =
    "SELECT r.rol, u.nombre, u.usuario, u.idusuario, u.fotoPerfil, r.idrol FROM usuario u JOIN rol r ON r.idrol=u.rol  WHERE correo = ?";

  connection.query($queryString, [emailUser], (err, rows) => {
    if (err) {
      return console.log("An error ocurred with the query", err);
    }
    if (rows.length > 0) {
      rows.forEach((row) => {
        if (row.rol != null || row.usuario != null) {
          //===============sessionStorage================

          function guardar_sessionStorage() {
            var rol = row.rol;
            var usuario = row.usuario;
            var foto = Uimg+row.fotoPerfil;
            var iusuario = row.idusuario;
            var idrol = row.idrol;
            var nombre = row.nombre;
            sessionStorage.setItem("usuario", usuario);
            sessionStorage.setItem("rol", rol);
            sessionStorage.setItem("idrol", idrol);
            sessionStorage.setItem("idusuario", iusuario);
            sessionStorage.setItem("fotoPerfil", foto);
            sessionStorage.setItem("nombre", nombre);
            window.setTimeout("location.reload()", 500);
            if (iusuario != sessionStorage.getItem("idusuario")) {
              sessionStorage.clear();
              guardar_sessionStorage();
            }
          }
          guardar_sessionStorage();
        }
      });
    }
  });
}
function dragstart_handler(ev) {
  console.log(
    "dragStart: dropEffect = " +
      ev.dataTransfer.dropEffect +
      " ; effectAllowed = " +
      ev.dataTransfer.effectAllowed
  );

  // Add this element's id to the drag payload so the drop handler will
  // know which element to add to its tree
  ev.dataTransfer.setData("text", ev.target.id);
  ev.dataTransfer.effectAllowed = "move";
}