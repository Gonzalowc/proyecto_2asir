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
    "SELECT idcliente, DNI, nombre, telefono, email, direccion, usuario_id FROM cliente  WHERE estatus=? ORDER BY idcliente";
  jefe = 1;
} else {
  $queryString =
    "SELECT idcliente, DNI, nombre, telefono, direccion, email FROM cliente WHERE estatus=1 and usuario_id = ? ORDER BY usuario_id";
}
connection.query($queryString, [jefe], (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
  let i = "";

  list_table += '<table id="tblDatos">';
  list_table += "<thead>";
  list_table += "<tr><th></th><th></th>";
  list_table += "<th></th>";
  if(sessionStorage.getItem("rol")== "SuperAdmin"){
    list_table += '<th></th>';
    }
  list_table += "<th></th><th></th><th></th>";
  list_table +=
    '<th><input type="text" name="busqueda" id="busqueda" placeholder="Buscar"></th><tr>';
  list_table += "<th>ID</th>";
  list_table += "<th>Nombre</th>";
  list_table += "<th>DNI</th>";
  list_table += "<th>telefono</th>";
  list_table += "<th>Dirección</th>";
  list_table += "<th>Email</th>";
  if(sessionStorage.getItem("rol")== "SuperAdmin"){
  list_table += '<th>Vendedor</th>';
  }
  list_table += "<th>Acciones</th>";
  list_table += "</tr>";
  list_table += "</thead>";
  list_table += "<tbody>";
  for (i = 0; i < results.length; i++) {
    list_table += "<tr>";
    list_table += "<td>" + results[i].idcliente + "</td>";
    list_table += "<td>" + results[i].nombre + "</td>";
    list_table += "<td>" + results[i].DNI + "</td>";
    list_table += "<td>" + results[i].telefono + "</td>";
    list_table += "<td>" + results[i].direccion + "</td>";
    list_table += "<td>" + results[i].email + "</td>";
    if(sessionStorage.getItem("rol") == "SuperAdmin"){
      list_table += '<td>'+ results[i].usuario_id +'</td>';
      }
    list_table +=
      '<td><a ondragstart="dragstart_handler(event);" onclick="timeoutclick()" class="link_edit" href="#"><i class="far fa-edit"></i> Editar</a> | ';
    list_table +=
      '<a ondragstart="dragstart_handler(event);" onclick="timeoutclick()" class="link_delete" href="#"><i class="far fa-trash-alt"></i> Borrar</a>';
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
var idrol = sessionStorage.getItem("idrol")
$queryString = "select * from rol where idrol = ?";
connection.query($queryString, [idrol], (err, results) => {
  if(err){
    return console.log("An error ocurred with the query", err);
  }
  if(results){
    html =""
    console.log(results);
    if(results[0].nuevoCli == 0){
      document.getElementById("nuevo").style.display = "none";
    }
  }
});
function click() {
  $(document).ready(function () {
    $(".link_edit").click(function () {
      //valores obtendra el dato del td por posciones [0]
      var ID = $(this).parents("tr").find("td")[0].innerHTML;
      var nombre = $(this).parents("tr").find("td")[1].innerHTML;
      var DNI = $(this).parents("tr").find("td")[2].innerHTML;
      var telefono = $(this).parents("tr").find("td")[3].innerHTML;
      var direccion = $(this).parents("tr").find("td")[4].innerHTML;
      var email = $(this).parents("tr").find("td")[5].innerHTML;
      var recuperar = "";

      recuperar += '<section id="containerEdit">';
      recuperar += '	 <div id="bodyEdit">';
      recuperar += "		 <h2> <i class='fas fa-users-cog'></i> Editar Cliente</h2>";
      recuperar += '		<label for="Nombre">Nombre</label>';
      recuperar +=
        '			<input id="name" name="nombre" value="' + nombre + '"></input>';
      recuperar += '   <label for="DNI">DNI</label>';
      recuperar += '			<input id="dni" name="DNI" value="' + DNI + '"></input>';
      recuperar += '		<label for="telefono">Teléfono</label>';
      recuperar +=
        '			<input id="telefono" name="telefono" value="' +
        telefono +
        '"></input>';
      recuperar += '		<label for="direccion">Dirección</label>';
      recuperar +=
        '			<input id="direccion" name="direccion" value="' +
        direccion +
        '"></input>';
      recuperar += '		<label for="email">Email</label>';
      recuperar +=
        '			<input id="email" name="email" value="' + email + '"></input>';
      recuperar += '   <label for="password">Contraseña</label>';
      recuperar +=
        '     <input type="password" id="password" name="password" placeholder="Verificar cambio con contraseña"></input>';
      recuperar += '   <div id="buttons">';
      recuperar += '			<button type="button" class="btn_cancel">Atrás</button>';
      recuperar += '			<button type="button" class="btn_save">Guardar Cambio</button>';
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
            var Nombre = document.getElementById("name").value;
            var DNI = document.getElementById("dni").value;
            var telefono = document.getElementById("telefono").value;
            var direccion = document.getElementById("direccion").value;
            var email = document.getElementById("email").value;
            $queryString =
              "UPDATE cliente set DNI=?, nombre=?, telefono=?, direccion=?, email=? where idcliente= ?";

            connection.query(
              $queryString,
              [DNI, Nombre, telefono, direccion, email, ID],
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
        });
      });
    });
    $(".link_delete").click(function () {
      //valores obtendra el dato del td por posciones [0]
      var ID = $(this).parents("tr").find("td")[0].innerHTML;
      var Nombre = $(this).parents("tr").find("td")[1].innerHTML;
      var DNI = $(this).parents("tr").find("td")[2].innerHTML;
      var Correo = $(this).parents("tr").find("td")[3].innerHTML;
      var recuperar = "";

      recuperar += '<section id="containerEdit">';
      recuperar += '<div class="alertModal">';
      recuperar += '	<div class="modal">';
      recuperar += '		<div id="bodyModal" class="bodyModal data_update"></div>';
      recuperar += "	</div>";
      recuperar += "</div>";
      recuperar += '	 <div id="bodyEdit">';
      recuperar += "		<h2>Borrar Cliente</h2>";
      recuperar += '		<label for="Nombre">Nombre</label>';
      recuperar +=
        '			<p id="name" name="nombre">' + Nombre + '</p>';
      recuperar += '		<label for="dni">DNI</label>';
      recuperar +=
        '			<p id="dni" name="dni">' + DNI + '</p>';
      recuperar += '		<label for="correo">Correo</label>';
      recuperar +=
        '			<p id="correo" name="Correo">' + Correo + '</p>';
      recuperar += '<label for="password">Contraseña</label>';
      recuperar +=
        '<input type="password" id="password" name="password" placeholder="Verificar cambio con contraseña"></input>';
      recuperar += '<div id="buttons">';
      recuperar += '			<button type="button" class="btn_cancel">Atrás</button>';
      recuperar += '			<button type="button" class="btn_save">Cambiar</button>';
      recuperar += '		</div>';
      recuperar += '	</div>';
      recuperar += '</section>';

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
            $queryString =
              "UPDATE cliente set estatus = 0 where idcliente= ?";

            connection.query($queryString, [ID], (err, results) => {
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
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
