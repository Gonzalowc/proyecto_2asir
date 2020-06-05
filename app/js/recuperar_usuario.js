//require jquery datatable
var $ = require("jquery");
var dt = require("datatables.net")(window, $);
//Paginador
var jefe = sessionStorage.getItem("idusuario");
var total_registro = "";
function timeoutclick() {
  click();
}
if (sessionStorage.getItem("rol") == "SuperAdmin") {
  $queryString =
    "SELECT COUNT(*) AS total_registro FROM usuario WHERE estatus=0";
} else {
  $queryString =
    "SELECT COUNT(*) AS total_registro FROM usuario WHERE estatus=0 and Jefe = ?";
}

connection.query($queryString, [jefe], (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
  total_registro = results[0].total_registro;
  sessionStorage.setItem("count_users", total_registro);
});
//==================listar usuarios

var list_table = "";

if (sessionStorage.getItem("rol") == "SuperAdmin") {
  $queryString =
    "SELECT u.idusuario, u.nombre, u.correo, u.usuario, u.Jefe, r.rol FROM usuario u INNER JOIN rol r ON r.idrol=u.rol WHERE estatus=? ORDER BY u.idusuario";
  jefe = 0;
} else {
  $queryString =
    "SELECT u.idusuario, u.nombre, u.correo,u.Jefe, u.usuario, r.rol FROM usuario u INNER JOIN rol r ON r.idrol=u.rol WHERE estatus=0 and Jefe = ? ORDER BY u.idusuario";
}
connection.query($queryString, [jefe], (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
  let i = "";

  list_table += '<table id="tblDatos">';
  list_table += "<thead>";
  list_table += "<tr><th></th>";
  list_table += "<th></th><th></th><th></th>";

  list_table += "<th></th>";

  list_table += "<th></th>";
  list_table +=
    '<th><input type="text" name="busqueda" id="busqueda" placeholder="Buscar"></th></tr><tr>';
  list_table += "<th>ID</th>";
  list_table += "<th>Nombre</th>";
  list_table += "<th>Usuario</th>";
  list_table += "<th>Correo</th>";

  list_table += "<th>Jefe</th>";

  list_table += "<th>Rol</th>";
  list_table += "<th>Acciones</th>";
  list_table += "</tr>";
  list_table += "</thead>";
  list_table += "<tbody>";
  for (i = 0; i < results.length; i++) {
    list_table += "<tr>";
    list_table += "<td>" + results[i].idusuario + "</td>";
    list_table += "<td>" + results[i].nombre + "</td>";
    list_table += "<td>" + results[i].usuario + "</td>";
    list_table += "<td>" + results[i].correo + "</td>";
    list_table += "<td>" + results[i].Jefe + "</td>";
    list_table += "<td>" + results[i].rol + "</td>";
    list_table +=
      '<td><a ondragstart="dragstart_handler(event);" onclick="timeoutclick()" class="link_recu" id="link_recu" href="#"><i class="far fa-edit"></i> Recuperar</a>';
    list_table += "</td>";
    list_table += "</tr>";
  }
  list_table += "</tbody>";
  list_table += "</table>";
  document.getElementById("table_date").innerHTML = list_table;
});

//==========================Buscador=======================
function buscador() {
  $(document).ready(function () {
    var consulta = $("#tblDatos").DataTable();
    $("#busqueda").keyup(function () {
      consulta.search($(this).val()).draw();
    });
  });
}
setTimeout("buscador()", 500);

//:::::::::::::::Fin:::::::::::::::Buscador:::::::::::::::::::::

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
function click() {
  $(document).ready(function () {
    $(".link_recu").click(function () {
      //valores obtendra el dato del td por posciones [0]
      var ID = $(this).parents("tr").find("td")[0].innerHTML;
      var Nombre = $(this).parents("tr").find("td")[1].innerHTML;
      var Usuario = $(this).parents("tr").find("td")[2].innerHTML;
      var Correo = $(this).parents("tr").find("td")[3].innerHTML;
      var Jefe = $(this).parents("tr").find("td")[4].innerHTML;
      var Rol = $(this).parents("tr").find("td")[5].innerHTML;
      var recuperar = "";

      recuperar += '<section id="containerEdit">';
      recuperar += '	 <div id="bodyEdit">';
      recuperar += "		<h2>Recuperar Usuario</h2>";
      recuperar += '		<label for="Nombre">Nombre</label>';
      recuperar += '			<p name="nombre">' + Nombre + "</p>";
      recuperar += '		<label for="Usuario">Usuario</label>';
      recuperar += '			<p name="Usuario">' + Usuario + "</p>";
      recuperar += '		<label for="Correo">Correo</label>';
      recuperar += '			<p name="Correo">' + Correo + "</p>";
      recuperar += '		<label for="Rol">Rol</label>';
      recuperar += '			<p name="Rol">' + Rol + "</p>";
      recuperar += '		<div id="buttons">';
      recuperar += '			<button type="button" class="btn_cancel">Atrás</button>';
      recuperar += '			<button type="button" class="btn_save">Restaurar</button>';
      recuperar += "		</div> ";
      recuperar += "	</div>";
      recuperar += "</section>";

      document.getElementById("Edit").innerHTML = recuperar;
      $(".btn_cancel").click(function () {
        location.reload();
      });
      $(".btn_save").click(function () {
        /* location.reload(); */
        $queryString =
          "UPDATE usuario set estatus=1 where idusuario= ? and estatus=0";

        connection.query($queryString, [ID], (err, results) => {
          if (err) {
            return console.log("An error ocurred with the query", err);
          }
          if (results) {
            location.reload();
          }
        });
      });
    });
  });
}
setTimeout("click()", 500);
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