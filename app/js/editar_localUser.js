// Jquery
var $ = require("jquery");

var idusu = sessionStorage.getItem("idusuario");
$queryString =
  "SELECT u.nombre, u.correo, u.usuario, r.rol FROM usuario u JOIN rol r ON u.rol=r.idrol WHERE idusuario= ?";
connection.query($queryString, [idusu], (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
  console.log(results);
  let name = results[0].nombre;
  let correo = results[0].correo;
  let usuario = results[0].usuario;
  let rol = results[0].rol;
  document.getElementById("name").setAttribute("value", name);
  document.getElementById("usuario").setAttribute("value", usuario);
  document.getElementById("correo").setAttribute("value", correo);
  document.getElementById("Rol").setAttribute("value", rol);
});

$queryString = "select fotoPerfil FROM usuario where idusuario= ?";

connection.query($queryString, [idusu], (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
  console.log(
    "https://drive.google.com/uc?export=view&id=" + results[0].fotoPerfil
  );

  document
    .getElementById("imgP")
    .setAttribute(
      "src",
      "https://drive.google.com/uc?export=view&id=" + results[0].fotoPerfil
    );
});
/*<img src='http://drive.google.com/uc?export=view&id=' + codigo alt="Usuario"'/>*/

$(".btnPerfil").click(function () {
  var recuperar = "";
  recuperar += '<section id="containerEdit" >';
  recuperar += '   <div class="alertModal">';
  recuperar += '   	<div class="modal">';
  recuperar += '   		<div id="bodyModal" class="bodyModal data_update"></div>';
  recuperar += "   	</div>";
  recuperar += "   </div>";
  recuperar += '   <div id="bodyEdit" style="width: 800px; height: 35vh;">';
  recuperar += "      <h1>Cambiar imagen</h1>";
  recuperar += '      <label for="Uri">URL Drive</label>';
  recuperar +=
    '      <input type="text" id="Uri" name="Uri" placeholder="URL"></input>';
  recuperar += '      <div id="buttons">';
  recuperar += '   	    <button type="button" class="btn_cancel">Atrás</button>';
  recuperar +=
    '   	    <button type="button" class="btn_save">Restaurar</button>';
  recuperar += "      </div> ";
  recuperar += "   </div>";
  recuperar += "</section>";
  document.getElementById("contBtn").innerHTML = recuperar;
  $(".btn_cancel").click(function () {
    location.reload();
  });

  $(".btn_save").click(function () {
    var ul = "";
    console.log("URL: " + ul);
    var uri = document
      .getElementById("Uri")
      .value.replace(
        /https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g,
        "$1"
      );

    var idusu = sessionStorage.getItem("idusuario");
    $queryString = "UPDATE usuario set fotoPerfil=? where idusuario= ?";

    connection.query($queryString, [uri, idusu], (err, results) => {
      if (err) {
        return console.log("An error ocurred with the query", err);
      }
      if (results) {
        sessionStorage.setItem("fotoPerfil", result[0].fotoPerfil);
        location.reload();
      }
    });
  });
});

$(".btnSave").click(function () {
  var idusu = sessionStorage.getItem("idusuario");
  var name = document.getElementById("name").value;
  var usuario = document.getElementById("usuario").value;
  var correo = document.getElementById("correo").value;
  var passwd = md5(document.getElementById("passwd").value);
  if (passwd == "") {
    $queryString =
      "UPDATE usuario set nombre = ?, usuario = ?, correo = ? where idusuario= ?";
    connection.query(
      $queryString,
      [name, usuario, correo, idusu],
      (err, results) => {
        if (err) {
          return console.log("An error ocurred with the query", err);
        }
        if (results) {
          location.reload();
        }
      }
    );
  } else {
    var recuperar = "";
    recuperar += '<section id="containerEdit" >';
    recuperar += '   <div class="alertModal">';
    recuperar += '   	<div class="modal">';
    recuperar += '   		<div id="bodyModal" class="bodyModal data_update"></div>';
    recuperar += "   	</div>";
    recuperar += "   </div>";
    recuperar += '   <div id="bodyEdit" style="width: 800px; height: 35vh;">';
    recuperar += "      <h1>Guardar Perfil</h1>";
    recuperar += '      <label for="password">Contraseña Actual</label>';
    recuperar +=
      '      <input type="password" id="password" name="password" placeholder="Contraseña Verificación"></input>';
    recuperar += '      <div id="buttons">';
    recuperar +=
      '   	    <button type="button" class="btn_cancel">Atrás</button>';
    recuperar +=
      '   	    <button type="button" id="btn_save" >Restaurar</button>';
    recuperar += "      </div> ";
    recuperar += "   </div>";
    recuperar += "</section>";
    document.getElementById("contBtn").innerHTML = recuperar;
    $(".btn_cancel").click(function () {
      location.reload();
    });
    /* ///::::::::::::::::::::::::::::::::::::::::::::::::// */
    $("#btn_save").click(function () {
      passwd;
      var pw = md5(document.getElementById("password").value);
      $queryString =
        "UPDATE usuario set nombre = ?, usuario = ?, correo = ?, clave = ? where idusuario= ? and clave=?";
      connection.query(
        $queryString,
        [name, usuario, correo, passwd, idusu, pw],
        (err, results) => {
          if (err) {
            return console.log("An error ocurred with the query", err);
          }
          if (results) {
            location.reload();
          }
        }
      );
    });
  }
});
