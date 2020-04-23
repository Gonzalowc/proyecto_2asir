//require jquery datatable
var $ = require("jquery");
var dt = require("datatables.net")(window, $);
//Paginador
var jefe = sessionStorage.getItem("idusuario");
//==================listar usuarios
function timeoutclick() {
  click();
}
var list_table = "";
if (sessionStorage.getItem("rol") == "SuperAdmin") {
  $queryString =
    "SELECT u.idusuario, u.nombre, u.correo, u.usuario, r.rol FROM usuario u INNER JOIN rol r ON r.idrol=u.rol WHERE estatus=? ORDER BY u.idusuario";
  jefe = 1;
} else {
  $queryString =
    "SELECT u.idusuario, u.nombre, u.correo, u.usuario, r.rol FROM usuario u INNER JOIN rol r ON r.idrol=u.rol WHERE estatus=1 and Jefe = ? ORDER BY u.idusuario";
}
connection.query($queryString, [jefe], (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
  let i = "";

  list_table += '<table id="tblDatos">';
  list_table += "<thead>";
  list_table += "<tr><th></th>";
  list_table += "<th></th><th></th><th></th><th></th>";
  list_table +=
    '<th><input type="text" name="busqueda" id="busqueda" placeholder="Buscar"></th><tr>';
  list_table += "<th>ID</th>";
  list_table += "<th>Nombre</th>";
  list_table += "<th>Usuario</th>";
  list_table += "<th>Correo</th>";
  list_table += "<th>Rol</th>";
  list_table += "<th>Acciones</th>";
  list_table += "</tr>";
  list_table += "</thead>";
  list_table += "<tbody>";
  for (i = 0; i < results.length; i++) {
    console.log(
      results[i].idusuario +
        " - " +
        results[i].nombre +
        " - " +
        results[i].usuario +
        " - " +
        results[i].correo +
        " - " +
        results[i].rol
    );
    list_table += "<tr>";
    list_table += "<td>" + results[i].idusuario + "</td>";
    list_table += "<td>" + results[i].nombre + "</td>";
    list_table += "<td>" + results[i].usuario + "</td>";
    list_table += "<td>" + results[i].correo + "</td>";
    list_table += "<td>" + results[i].rol + "</td>";
    list_table +=
      '<td><a onclick="timeoutclick()" class="link_edit" id="link_edit" href="#"><i class="far fa-edit"></i> Editar</a> | ';
    list_table +=
      '<a onclick="timeoutclick()" class="link_delete" href="#"><i class="far fa-trash-alt"></i> Borrar</a>';
    list_table += "</td>";
    list_table += "</tr>";
  }
  list_table += "</tbody>";
  list_table += "</table>";
  document.getElementById("table_date").innerHTML = list_table;
});

if (sessionStorage.getItem("rol") === "SuperAdmin") {
}

//buscador+paginador
function buscador() {
  $(document).ready(function () {
    var consulta = $("#tblDatos").DataTable();
    $("#busqueda").keyup(function () {
      consulta.search($(this).val()).draw();
    });
  });
}
setTimeout("buscador()", 500);

var table = "#tblDatos";
$("#maxRows").on("change", function () {
  $(".pagination").html();
  var trnum = 0;
  var maxRows = parseInt($(this).val());
  var totalRows = $(table + " tbody tr").length;
  $(table + " tr:tg(0)").each(function () {
    trnum++;
    if (trnum > maxRows) {
      $(this).hide();
    }
    if (trnum <= maxRows) {
      $(this).show();
    }
  });
  if (totalRows > maxRows) {
    var pagenum = Math.ceil(totalRows / maxRows);
    for (var i = 1; i < pagenum; i++) {
      $(".pagination")
        .append(
          '<li data-page="' +
            i +
            '"><span>' +
            i++ +
            '<span class="sr-only">(current)</span></span></li>'
        )
        .show();
    }
  }
  $(".pagination li:first-child").addClass("active");
  $(".pagination li").on("click", function () {
    var pageNum = $(this).attr("data-page");
    var trIndex = 0;
    $(".pagination li").removeClass("active");
    $(this).addClass("active");
    $(table + " tr:gt(0)").each(function () {
      trIndex++;
      if (
        trIndex > maxRows * pageNum ||
        trIndex <= maxRows * pageNum - maxRows
      ) {
        $(this).hide();
      } else {
        $(this).show();
      }
    });
  });
});
$queryString = "SELECT idrol, rol from rol where rol = ?";
let rol = sessionStorage.getItem("rol");
connection.query($queryString, [rol], (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
  if (results) {
    /*  if( sessionStorage.getItem("rol") == ) */
    $queryString = "SELECT idrol, rol from rol where idrol > ?";
    var i = "";
    i = results[0].idrol;
    connection.query($queryString, [i], (err, results) => {
      if (err) {
        return console.log("An error ocurred with the query", err);
      }
      if (results) {
        var i = 0;
        var Rol = $("#tblDatos tr")
          .find("td:eq(4)")
          .each(() => {
            var valor = $(this).html();
            valor += valor.concat(valor);
            console.log(valor);
          });
        while (i < results.length) {
          var edit = document.querySelector("#link_edit");
          if (Rol != results[i].rol) {
            edit.style.display = "none";
          }
          console.log(results[i]);

          i++;
        }
      }
    });
  }
});
function click() {
  $(document).ready(function () {
    $(".link_edit").click(function () {
      //valores obtendra el dato del td por posciones [0]
      var ID = $(this).parents("tr").find("td")[0].innerHTML;
      var Nombre = $(this).parents("tr").find("td")[1].innerHTML;
      var Usuario = $(this).parents("tr").find("td")[2].innerHTML;
      var Correo = $(this).parents("tr").find("td")[3].innerHTML;
      console.log(ID + ", " + Nombre + ", " + Usuario + ", " + Correo);
      var recuperar = "";
      var roles = "";

      recuperar += '<section id="containerEdit">';
      recuperar += '<div class="alertModal">';
      recuperar += '	<div class="modal">';
      recuperar += '		<div id="bodyModal" class="bodyModal data_update"></div>';
      recuperar += "	</div>";
      recuperar += "</div>";
      recuperar += '	 <div id="bodyEdit">';
      recuperar += "		<h2>Editar Usuario</h2>";
      recuperar += '		<label for="Nombre">Nombre</label>';
      recuperar +=
        '			<input id="name" name="nombre" value="' + Nombre + '"></input>';
      recuperar += '		<label for="Usuario">Usuario</label>';
      recuperar +=
        '			<input id="usuario" name="Usuario" value="' + Usuario + '"></input>';
      recuperar += '		<label for="Correo">Correo</label>';
      recuperar +=
        '			<input id="correo" name="Correo" value="' + Correo + '"></input>';
      recuperar += '		<label for="Rol">Rol</label>';
      recuperar += '<select id="roles" name="Rol">';
      $queryString = "SELECT idrol, rol FROM rol";
      connection.query($queryString, (err, results) => {
        if (err) {
          return console.log("An error ocurred with the query", err);
        }
        var i = 2;
        for (i; i < results.length; i++) {
          console.log(results[i].rol + " - " + results[i].idrol);

          roles +=
            '<option value="' +
            results[i].idrol +
            '">' +
            results[i].rol +
            "</option>";
        }
        document.getElementById("roles").innerHTML = roles;
      });
      recuperar += "	</select>";
      recuperar += '<label for="password">Contraseña</label>';
      recuperar +=
        '<input type="password" id="password" name="password" placeholder="Verificar cambio con contraseña"></input>';
      recuperar += '<div id="buttons">';
      recuperar += '			<button type="button" class="btn_cancel">Atrás</button>';
      recuperar += '			<button type="button" class="btn_save">Cambiar</button>';
      recuperar += "		</div> ";
      recuperar += "	</div>";
      recuperar += "</section>";

      document.getElementById("actions").innerHTML = recuperar;
      $(".btn_cancel").click(function () {
        location.reload();
      });
      $(".btn_save").click(function () {
        var idusu = sessionStorage.getItem("idusuario");
        var clave = md5(document.getElementById("password").value);
        $queryString =
          "SELECT idusuario, clave FROM usuario WHERE idusuario =?";

        connection.query($queryString, [idusu], (err, results) => {
          if (err) {
            return console.log("An error ocurred with the query", err);
          }
          if (results[0].idusuario == idusu && results[0].clave == clave) {
            var Rol = document.getElementById("roles").value;
            var Nombre = document.getElementById("name").value;
            var Correo = document.getElementById("correo").value;
            var Usuario = document.getElementById("usuario").value;
            $queryString =
              "UPDATE usuario set nombre=?, correo=?, usuario=?, rol=? where idusuario= ?";

            connection.query(
              $queryString,
              [Nombre, Correo, Usuario, Rol, ID],
              (err, results) => {
                if (err) {
                  return console.log("An error ocurred with the query", err);
                }
                if (results) {
                  location.reload();
                }
              }
            );
          }
          var messerror =
            '<p class="msg_error">Error al actualizar el Usuario</p>';
          document.getElementById("bodyModal").innerHTML = messerror;
        });
      });
    });
  });
}
setTimeout("click()", 500);
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
